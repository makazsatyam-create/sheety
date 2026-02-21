import AccountModel from "../models/accountModel.js";

// Add new account
export const addAccount = async (req, res) => {
  try {
    console.log("Add account request received:", {
      body: req.body,
      userId: req.id,
      user: req.user,
      role: req.role,
    });

    // Check if user is superadmin
    if (req.role !== "supperadmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Super Admin can create accounts.",
      });
    }

    const { type, option, ...accountData } = req.body;
    const userId = req.id || req.user?.id || req.user?._id;

    if (!userId) {
      console.error("No user ID found in request");
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // Validate based on account type
    if (type === "bank") {
      const { accountNumber, accountHolder, bankName, branchName, ifscCode } =
        accountData;
      if (
        !accountNumber ||
        !accountHolder ||
        !bankName ||
        !branchName ||
        !ifscCode
      ) {
        return res.status(400).json({
          success: false,
          message: "All bank account fields are required",
        });
      }
    } else if (type === "upi") {
      const { qrCode, upiId } = accountData;
      if (!qrCode || !upiId) {
        return res.status(400).json({
          success: false,
          message: "QR code and UPI ID are required",
        });
      }
    } else if (type === "crypto") {
      const { currency, walletAddress } = accountData;
      if (!currency || !walletAddress) {
        return res.status(400).json({
          success: false,
          message: "Currency and wallet address are required",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid account type",
      });
    }

    const account = new AccountModel({
      type,
      option: type !== "crypto" ? option : undefined,
      ...accountData,
      createdBy: userId,
    });

    await account.save();

    console.log("Account saved successfully:", account._id);

    res.status(201).json({
      success: true,
      message: "Account added successfully",
      data: account,
    });
  } catch (error) {
    console.error("Error adding account:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add account",
    });
  }
};

// Get all accounts
export const getAccounts = async (req, res) => {
  try {
    const userId = req.id || req.user?.id || req.user?._id;
    const { type } = req.query;

    const query = { createdBy: userId };
    if (type) {
      query.type = type;
    }

    const accounts = await AccountModel.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch accounts",
    });
  }
};

// Get single account
export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id || req.user?.id || req.user?._id;

    const account = await AccountModel.findOne({ _id: id, createdBy: userId });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch account",
    });
  }
};

// Update account
export const updateAccount = async (req, res) => {
  try {
    // Check if user is superadmin
    if (req.role !== "supperadmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Super Admin can update accounts.",
      });
    }

    const { id } = req.params;
    const userId = req.id || req.user?.id || req.user?._id;
    const updateData = req.body;

    const account = await AccountModel.findOne({ _id: id, createdBy: userId });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    Object.assign(account, updateData);
    await account.save();

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: account,
    });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update account",
    });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    // Check if user is superadmin
    if (req.role !== "supperadmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Super Admin can delete accounts.",
      });
    }

    const { id } = req.params;
    const userId = req.id || req.user?.id || req.user?._id;

    const account = await AccountModel.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete account",
    });
  }
};

// Get public accounts (for client deposit page - no auth required)
export const getPublicAccounts = async (req, res) => {
  try {
    const { type, option } = req.query;

    const query = { status: "active" };
    if (type) {
      query.type = type;
    }
    if (option) {
      query.option = option;
    }

    const accounts = await AccountModel.find(query)
      .select("-createdBy -__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    console.error("Error fetching public accounts:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch accounts",
    });
  }
};
