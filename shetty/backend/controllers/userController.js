// import User from "../models/userModel.js";
import axios from "axios";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import betModel from "../models/betModel.js";
import LoginHistory from "../models/loginHistory.js";
import passwordHistory from "../models/passwordHistory.js";
import SubAdmin from "../models/subAdminModel.js";
import { updateAllUplines } from "./admin/subAdminController.js";

const OTP_BASE_URL = process.env.OTP_URL;
//send otp to user for registration
export const sendOtp = async (req, res) => {
  try {
    const mobile = String(req.query.mobile || req.body.mobile || "")
      .replace(/\D/g, "")
      .slice(0, 10);
    if (mobile.length !== 10) {
      return res
        .status(400)
        .json({ message: "Valid 10-digit mobile number is required" });
    }

    //for live environment use mode=live and for test environment use mode=test
    const url = `${OTP_BASE_URL}/send_otp.php?mode=live&digit=4&mobile=${mobile}`;
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;
    const err = data && data.error;
    if (err && String(err) !== "200") {
      return res
        .status(400)
        .json({ message: data.msg || data.error || "Failed to send OTP" });
    }
    res.status(200).json({ message: data.msg || "OTP sent successfully" });
  } catch (error) {
    const msg =
      error.response?.data?.msg || error.response?.data?.error || error.message;
    res.status(500).json({ message: msg || "Failed to send OTP" });
  }
};

// Send OTP to logged-in user's registered mobile (for withdrawal verification)
export const sendWithdrawalOtp = async (req, res) => {
  try {
    if (!OTP_BASE_URL) {
      return res
        .status(503)
        .json({ message: "OTP service is not configured" });
    }
    const userId = req.id || req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await SubAdmin.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const phone = user.phone;
    if (!phone) {
      return res
        .status(400)
        .json({ message: "No mobile number registered for your account" });
    }
    const mobile = String(phone).replace(/\D/g, "").slice(-10);
    if (mobile.length !== 10) {
      return res
        .status(400)
        .json({ message: "Valid 10-digit mobile number is required" });
    }
    const url = `${OTP_BASE_URL}/send_otp.php?mode=live&digit=4&mobile=${mobile}`;
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;
    const err = data && data.error;
    if (err && String(err) !== "200") {
      return res
        .status(400)
        .json({ message: data.msg || data.error || "Failed to send OTP" });
    }
    res.status(200).json({ message: data.msg || "OTP sent successfully" });
  } catch (error) {
    const msg =
      error.response?.data?.msg ||
      error.response?.data?.error ||
      error.message;
    res.status(500).json({ message: msg || "Failed to send OTP" });
  }
};

// Verify OTP for withdrawal (used by withdrawal controller or can be called from client)
export const verifyWithdrawalOtp = async (userId, otp) => {
  if (!OTP_BASE_URL || !userId || !otp || !String(otp).trim()) {
    return { valid: false, message: "OTP and user required" };
  }
  const user = await SubAdmin.findById(userId);
  if (!user || !user.phone) {
    return { valid: false, message: "User or phone not found" };
  }
  const mobile = String(user.phone).replace(/\D/g, "").slice(-10);
  if (mobile.length !== 10) {
    return { valid: false, message: "Invalid phone" };
  }
  try {
    const verifyUrl = `${OTP_BASE_URL}/verifyotp.php?mobile=${mobile}&otp=${encodeURIComponent(String(otp).trim())}`;
    const verifyRes = await axios.get(verifyUrl, { timeout: 10000 });
    const verifyData = verifyRes.data;
    if (verifyData && String(verifyData.error) !== "200") {
      return { valid: false, message: verifyData.msg || "Invalid or expired OTP" };
    }
    return { valid: true };
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    return { valid: false, message: msg || "Verification failed" };
  }
};

// Forgot password: verify OTP and set new password
export const forgotPasswordReset = async (req, res) => {
  try {
    const { mobile, otp, newPassword } = req.body;
    const mobileStr = String(mobile || "").replace(/\D/g, "").slice(0, 10);
    if (mobileStr.length !== 10 || !otp || !newPassword) {
      return res.status(400).json({
        message: "Mobile number, OTP and new password are required",
      });
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with both letters and numbers. Special characters are not allowed.",
      });
    }
    const verifyUrl = `${OTP_BASE_URL}/verifyotp.php?mobile=${mobileStr}&otp=${encodeURIComponent(otp.trim())}`;
    const verifyRes = await axios.get(verifyUrl, { timeout: 10000 });
    const verifyData = verifyRes.data;
    if (verifyData && String(verifyData.error) !== "200") {
      return res
        .status(400)
        .json({ message: verifyData.msg || "Invalid or expired OTP" });
    }
    const phoneNum = parseInt(mobileStr, 10);
    // Match phone as number or string (legacy or different storage)
    const user = await SubAdmin.findOne({
      $or: [{ phone: phoneNum }, { phone: mobileStr }],
      role: "user",
      status: "active",
    });
    if (!user) {
      return res.status(400).json({
        message: "No account found with this mobile number. Use the number registered with your account.",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    const msg =
      error.response?.data?.msg ||
      error.response?.data?.error ||
      error.message;
    res.status(500).json({ message: msg || "Failed to reset password" });
  }
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { userName, password, campaignCode, phone, otp } = req.body;
    if (!userName || !password || !phone || !otp) {
      return res
        .status(400)
        .json({ message: "Username, password, phone and OTP are required" });
    }
    const mobile = String(phone).replace(/\D/g, "").slice(0, 10);
    if (mobile.length !== 10) {
      return res
        .status(400)
        .json({ message: "Valid 10-digit phone number is required" });
    }

    const verifyUrl = `${OTP_BASE_URL}/verifyotp.php?mobile=${mobile}&otp=${encodeURIComponent(otp)}`;
    const verifyRes = await axios.get(verifyUrl, { timeout: 10000 });
    const verifyData = verifyRes.data;
    if (verifyData && String(verifyData.error) !== "200") {
      return res
        .status(400)
        .json({ message: verifyData.msg || "Invalid or expired OTP" });
    }

    const invite =
      (campaignCode && String(campaignCode).trim()) ||
      (process.env.DEFAULT_SIGNUP_INVITE_CODE &&
        process.env.DEFAULT_SIGNUP_INVITE_CODE.trim()) ||
      null;

    let upline = null;
    if (invite) {
      upline = await SubAdmin.findOne({
        code: invite.toUpperCase().trim(),
        status: { $ne: "delete" },
      });
    }
    // Fallback: use any admin/agent as default upline when no valid code is provided
    if (!upline) {
      upline = await SubAdmin.findOne({
        role: {
          $in: ["supperadmin", "admin", "agent", "master", "super", "white"],
        },
        status: { $ne: "delete" },
      }).sort({ createdAt: 1 });
    }
    if (!upline) {
      return res.status(400).json({
        message:
          "No upline available for signup. Add an admin/agent in the dashboard first, or set DEFAULT_SIGNUP_INVITE_CODE in .env to a valid code.",
      });
    }

    const existing = await SubAdmin.findOne({
      userName: userName.toLowerCase(),
    });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with both letters and numbers. Special characters are not allowed.",
      });
    }

    const uniqueCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    const subAdmin = new SubAdmin({
      name: userName.trim(),
      userName: userName.toLowerCase().trim(),
      account: "user",
      code: uniqueCode,
      invite: upline.code,
      phone: parseInt(mobile, 10),
      password,
      role: "user",
      status: "active",
      balance: 0,
      baseBalance: 0,
      totalBalance: 0,
      avbalance: 0,
      totalAvbalance: 0,
      creditReference: 0,
      creditReferenceProfitLoss: 0,
      bettingProfitLoss: 0,
      exposure: 0,
      totalExposure: 0,
      exposureLimit: 0,
    });
    await subAdmin.save();
    await updateAllUplines(subAdmin._id);

    res.status(201).json({
      message: "Registration successful",
      data: { userName: subAdmin.userName },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

const saveLoginHistory = async (userName, id, status, req) => {
  // console.log("dfghjk");
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      "IP not found";

    // console.log("🔥 Final IP:", ip);

    // ✅ Get geo details
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { city, region, country_name: country, org: isp } = response.data;

    const now = new Date();
    const formattedDateTime = now
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");

    await LoginHistory.create({
      userName,
      userId: id,
      status: status === "Success" ? "Login Successful" : "Login Failed",
      dateTime: formattedDateTime,
      ip,
      isp,
      city,
      region,
      country,
    });
  } catch (error) {
    console.error("🚨 Login history error:", error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    //  Check if userName and password are provided
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both username and password." });
    }

    // Find user by userName (case-insensitive)
    const user = await SubAdmin.findOne({ userName: userName.toLowerCase() });
    if (!user) {
      await saveLoginHistory(
        userName,
        "user not found",
        "Invalid UserName.",
        req,
      );
      return res.status(400).json({ message: "Username not found." });
    }
    if (user.status !== "active") {
      return res
        .status(400)
        .json({ message: `Your Account is ${user.status}...` });
    }

    if (user.role !== "user") {
      await saveLoginHistory(userName, user._id, "Login With Admin Id", req);
      return res
        .status(400)
        .json({ message: "This Dashboard is for User Dashboard..." });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await saveLoginHistory(userName, user._id, "Invalid Password.", req);
      return res.status(400).json({ message: "Incorrect password." });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    //  Set token in HTTP-only cookie
    res.cookie("auth", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await saveLoginHistory(userName, user._id, "Success", req);

    //  Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
      isPasswordChanged: user.isPasswordChanged,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req; // Get ID from request

    if (!id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    //  Find sub-admin & exclude sensitive fields
    const user = await SubAdmin.findById(id).select(
      "-password -masterPassword",
    );

    if (!user) {
      return res.status(404).json({ message: "Sub-admin not found" });
    }

    //  Calculate exposure considering offset bets
    const updatedPendingBets = await betModel.find({ userId: id, status: 0 });

    // Calculate exposure considering offset bets
    let currentExposure = updatedPendingBets.reduce((sum, b) => {
      const price = b.price || 0;
      const betAmount = b.betAmount || 0;

      // Negative price = guaranteed profit, no exposure
      if (price < 0) return sum + 0;

      // Negative betAmount = offset bet, use worst-case
      if (betAmount < 0) return sum + Math.max(Math.abs(betAmount), price);

      // Normal bet: exposure = price
      return sum + price;
    }, 0);

    // SPECIAL CASE: If user has fancy bets, recalculate using fancy logic
    const hasFancyBets = updatedPendingBets.some((b) => b.betType === "fancy");

    if (hasFancyBets) {
      // Override with fancy-specific exposure calculation
      const betsByMarket = {};
      updatedPendingBets.forEach((bet) => {
        const marketKey = `${bet.gameId}_${bet.teamName}`;
        if (!betsByMarket[marketKey]) {
          betsByMarket[marketKey] = [];
        }
        betsByMarket[marketKey].push(bet);
      });

      let fancyExposure = 0;
      Object.values(betsByMarket).forEach((marketBets) => {
        const backBets = marketBets.filter((b) => b.otype === "back");
        const layBets = marketBets.filter((b) => b.otype === "lay");

        const fancyScores = [...new Set(marketBets.map((b) => b.fancyScore))];
        let marketExposure = 0;

        if (backBets.length > 0 && layBets.length > 0) {
          // Both back and lay bets exist - calculate based on fancy score scenarios
          const scenarioResults = [];

          fancyScores.forEach((score) => {
            const backBetsAtScore = backBets.filter(
              (b) => b.fancyScore === score,
            );
            const layBetsAtScore = layBets.filter(
              (b) => b.fancyScore === score,
            );

            // Scenario: Actual score >= fancy score (Back wins, Lay loses)
            const backWinProfit = backBetsAtScore.reduce(
              (sum, b) => sum + (b.xValue * b.betAmount) / 100,
              0,
            );
            const layLossAmount = layBetsAtScore.reduce(
              (sum, b) => sum + (b.xValue * b.betAmount) / 100,
              0,
            );
            const scenario1Net = backWinProfit - layLossAmount;

            // Scenario: Actual score < fancy score (Back loses, Lay wins)
            const backLossAmount = backBetsAtScore.reduce(
              (sum, b) => sum + b.betAmount,
              0,
            );
            const layWinProfit = layBetsAtScore.reduce(
              (sum, b) => sum + b.betAmount,
              0,
            );
            const scenario2Net = layWinProfit - backLossAmount;

            scenarioResults.push(scenario1Net, scenario2Net);
          });

          const maxLoss = Math.min(...scenarioResults);
          marketExposure = Math.abs(maxLoss);
        } else if (backBets.length > 0) {
          marketExposure = backBets.reduce((sum, b) => sum + b.betAmount, 0);
        } else if (layBets.length > 0) {
          marketExposure = layBets.reduce(
            (sum, b) => sum + (b.xValue * b.betAmount) / 100,
            0,
          );
        }

        fancyExposure += marketExposure;
      });

      // FIX: Add non-fancy exposure (sports/casino) to fancy exposure
      const nonFancyBets = updatedPendingBets.filter(
        (b) => b.betType !== "fancy",
      );
      const nonFancyExposure = nonFancyBets.reduce((sum, b) => {
        const price = b.price || 0;
        const betAmount = b.betAmount || 0;
        if (price < 0) return sum; // Guaranteed profit, no exposure
        if (betAmount < 0) return sum + Math.max(Math.abs(betAmount), price); // Offset bet
        return sum + price; // Normal bet
      }, 0);

      currentExposure = fancyExposure + nonFancyExposure;
    }

    //  Create response object with calculated exposure (ORIGINAL user + new exposure)
    const userWithExposure = {
      ...user.toObject(), // ← Use .toObject() to get clean copy
      exposure: currentExposure,
    };

    res.status(200).json({
      message: "Sub-admin details retrieved successfully",
      data: userWithExposure, // ← Send the new object, not the modified user
    });
  } catch (error) {
    console.error("Error fetching sub-admin:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
export const changePasswordByUserSelf = async (req, res) => {
  const { id } = req; // Sub-admin ID (admin making the change)
  try {
    const { oldPassword, newPassword } = req.body;

    const subAdmin = await SubAdmin.findById(id);
    if (!subAdmin) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, subAdmin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old Password Wrong !" });
    }

    // Validate new password: must contain letters AND numbers, NO special characters
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with both letters and numbers. Special characters are not allowed.",
      });
    }

    // Assign plaintext - pre-save hook will hash it
    subAdmin.password = newPassword;

    await subAdmin.save();
    await passwordHistory.create({
      userName: subAdmin.userName,
      remark: "Password Changed By Self.",
      userId: id,
    });
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",

      data: subAdmin,
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const changePasswordByFirstLogin = async (req, res) => {
  const { id } = req;
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    console.log("oldPassword", oldPassword);
    console.log("newPassword", newPassword);
    console.log("confirmPassword", confirmPassword);

    const subAdmin = await SubAdmin.findById(id);
    if (!subAdmin) {
      return res.status(404).json({ message: "User not found" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New Password and Password Confirmation should be same",
      });
    }

    // Validate new password: must contain letters AND numbers, NO special characters
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with both letters and numbers. Special characters are not allowed.",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, subAdmin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old Password Has Not Matched!" });
    }
    subAdmin.password = newPassword;

    //Also i have to match the newPassword and the confirmPassword
    if (!subAdmin.isPasswordChanged) {
      subAdmin.isPasswordChanged = true;
    }

    await subAdmin.save();

    // Create password history record
    await passwordHistory.create({
      userName: subAdmin.userName,
      remark: "Password Changed By First Login.",
      userId: id,
    });
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      isPasswordChanged: true,
      data: subAdmin,
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getPasswordHistoryByUserId = async (req, res) => {
  const { id } = req;
  try {
    // passed in route as /credit-ref-history/:userId
    const { page = 1, limit = 10, searchQuery = "" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const filter = {
      userId: id,
    };

    const data = await passwordHistory
      .find(filter)
      .sort({ createdAt: -1 }) // optional: latest first
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await passwordHistory.countDocuments(filter);

    return res.status(200).json({
      message: "Password History fetched successfully",
      data,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching creditRefHistory:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};
export const getLoginHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await LoginHistory.find({ userId });
    res.status(200).json({
      message: "Login history fetched successfully",
      data,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching login history:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const user_logout = async (req, res) => {
  res.clearCookie("auth", {
    httpOnly: true, // must match the cookie options used when setting
    secure: true, // only if you're using HTTPS
    sameSite: "None", // or 'Lax' or 'Strict', must match
    path: "/", // make sure path is same as when set
  });

  res.status(200).json({ message: "Logout success" });
};

// Update User Profile (email, address, city, pincode)
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req;
    const { email, address, city, pincode } = req.body;

    const user = await SubAdmin.findByIdAndUpdate(
      id,
      {
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(pincode !== undefined && { pincode }),
      },
      { new: true },
    ).select("-password -masterPassword");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Quick Stakes
export const updateQuickStakes = async (req, res) => {
  try {
    const { id } = req;
    const { quickStakes } = req.body;

    if (!Array.isArray(quickStakes) || quickStakes.length !== 8) {
      return res
        .status(400)
        .json({ message: "Please provide exactly 8 stake values" });
    }

    // Validate all values are positive numbers
    const isValid = quickStakes.every(
      (val) => typeof val === "number" && val > 0,
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ message: "All stake values must be positive numbers" });
    }

    const user = await SubAdmin.findByIdAndUpdate(
      id,
      { quickStakes },
      { new: true },
    ).select("-password -masterPassword");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Quick stakes updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update Quick Stakes Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Theme
export const updateTheme = async (req, res) => {
  try {
    const { id } = req;
    const { theme } = req.body;

    // Define allowed themes (must match your theme config)
    const allowedThemes = [
      "blueGreen",
      "blackOrange",
      "tealDarkteal",
      "grayBlack",
      "greenBlack",
    ];

    if (!theme || !allowedThemes.includes(theme)) {
      return res.status(400).json({ message: "Invalid theme selection" });
    }

    const user = await SubAdmin.findByIdAndUpdate(
      id,
      { theme },
      { new: true },
    ).select("-password -masterPassword");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Theme updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update Theme Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
