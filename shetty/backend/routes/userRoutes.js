import express from "express";

import {
  sendOtp,
  sendWithdrawalOtp,
  forgotPasswordReset,
  registerUser,
  changePasswordByFirstLogin,
  changePasswordByUserSelf,
  getLoginHistory,
  getPasswordHistoryByUserId,
  getUserById,
  loginUser,
  updateQuickStakes,
  updateTheme,
  updateUserProfile,
  user_logout,
} from "../controllers/userController.js";
import {
  createDepositRequest,
  getUserDepositHistory,
  getUserDepositRequests,
  cancelDepositRequest,
} from "../controllers/depositRequestController.js";
import {
  createWithdrawalRequest,
  getUserWithdrawalHistory,
  getUserWithdrawalRequests,
  cancelWithdrawalRequest,
} from "../controllers/withdrawalRequestController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/send-otp", sendOtp);
router.post("/forgot-password/reset", forgotPasswordReset);
router.post("/register", registerUser);

router.post("/user/login", loginUser);

router.get("/get/user-details", authMiddleware, getUserById);
router.get("/customer/logout", user_logout);
router.post(
  "/change/password-self/user",
  authMiddleware,
  changePasswordByUserSelf,
);
router.post(
  "/change/password/first-login",
  authMiddleware,
  changePasswordByFirstLogin,
);
router.get("/password/history", authMiddleware, getPasswordHistoryByUserId);
router.get("/get/user-login-history/:userId", authMiddleware, getLoginHistory);
router.post("/update/user-profile", authMiddleware, updateUserProfile);
router.put("/update/quick-stakes", authMiddleware, updateQuickStakes);
router.put("/update/theme", authMiddleware, updateTheme);

// Send OTP to logged-in user's phone (for withdrawal)
router.post("/send-withdrawal-otp", authMiddleware, sendWithdrawalOtp);

// Deposit and Withdrawal Request Routes (for users)
router.post("/deposit-request", authMiddleware, createDepositRequest);
router.post("/withdrawal-request", authMiddleware, createWithdrawalRequest);

// Get deposit/withdrawal history and requests
router.get("/user/deposit-history", authMiddleware, getUserDepositHistory);
router.get("/user/deposit-requests", authMiddleware, getUserDepositRequests);
router.get("/user/withdrawal-history", authMiddleware, getUserWithdrawalHistory);
router.get("/user/withdrawal-requests", authMiddleware, getUserWithdrawalRequests);

// Cancel deposit/withdrawal requests
router.put("/user/deposit-request/:requestId/cancel", authMiddleware, cancelDepositRequest);
router.put("/user/withdrawal-request/:requestId/cancel", authMiddleware, cancelWithdrawalRequest);

export default router;
