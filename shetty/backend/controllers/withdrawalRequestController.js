import WithdrawalRequest from '../models/withdrawalRequestModel.js';
import SubAdmin from '../models/subAdminModel.js';
import WithdrawalHistory from '../models/withdrawalHistoryModel.js';
import TransactionHistory from '../models/transtionHistoryModel.js';
import { updateAdmin, updateAllUplines } from './admin/subAdminController.js';
import { verifyWithdrawalOtp } from './userController.js';

// Create withdrawal request
export const createWithdrawalRequest = async (req, res) => {
  try {
    const userId = req.id || req.user?.id || req.user?._id;
    const user = await SubAdmin.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      amount,
      paymentType,
      option,
      accountNumber,
      accountHolderName,
      bankName,
      branchName,
      ifscCode,
      currency,
      walletAddress,
      remark,
      otp,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    if (amount > user.avbalance || amount > user.balance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
      });
    }

    if (!paymentType) {
      return res.status(400).json({
        success: false,
        message: 'Payment type is required',
      });
    }

    // OTP verification required for withdrawal
    if (!otp || !String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required for withdrawal. Please request OTP and enter it.',
      });
    }
    const otpResult = await verifyWithdrawalOtp(userId, otp);
    if (!otpResult.valid) {
      return res.status(400).json({
        success: false,
        message: otpResult.message || 'Invalid or expired OTP',
      });
    }

    // Validate payment type specific fields
    if (paymentType === 'bank') {
      if (!accountNumber || !accountHolderName || !bankName || !ifscCode) {
        return res.status(400).json({
          success: false,
          message: 'All bank account details are required',
        });
      }
    } else if (paymentType === 'crypto') {
      if (!currency || !walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Currency and wallet address are required',
        });
      }
    }

    const withdrawalRequest = new WithdrawalRequest({
      userId: userId.toString(),
      userName: user.userName,
      amount,
      paymentType,
      option,
      accountNumber,
      accountHolderName,
      bankName,
      branchName,
      ifscCode,
      currency,
      walletAddress,
      remark,
      status: 'pending',
    });

    await withdrawalRequest.save();

    res.status(201).json({
      success: true,
      message: 'Withdrawal request created successfully',
      data: withdrawalRequest,
    });
  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create withdrawal request',
    });
  }
};

// Get all withdrawal requests (for admin)
export const getWithdrawalRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const requests = await WithdrawalRequest.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch withdrawal requests',
    });
  }
};

// Approve withdrawal request
export const approveWithdrawalRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const adminId = req.id || req.user?.id || req.user?._id;
    const admin = await SubAdmin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    const withdrawalRequest = await WithdrawalRequest.findById(requestId);

    if (!withdrawalRequest) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found',
      });
    }

    if (withdrawalRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed',
      });
    }

    const user = await SubAdmin.findById(withdrawalRequest.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { amount } = withdrawalRequest;

    // Check balance again
    if (amount > user.avbalance || amount > user.balance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
      });
    }

    // Update user balance
    user.avbalance = Math.max(0, user.avbalance - amount);
    user.balance -= amount;
    user.baseBalance -= amount;
    user.creditReferenceProfitLoss = user.baseBalance - user.creditReference;
    await user.save();

    // Update admin balance
    admin.balance += amount;
    admin.baseBalance += amount;
    admin.avbalance += amount;
    await admin.save();

    // Update withdrawal request status
    withdrawalRequest.status = 'approved';
    withdrawalRequest.approvedBy = admin.userName;
    await withdrawalRequest.save();

    // Create withdrawal history
    await WithdrawalHistory.create({
      userName: user.userName,
      amount: amount,
      remark: withdrawalRequest.remark || 'Withdrawal',
      invite: admin.code,
    });

    // Create transaction history
    await TransactionHistory.create({
      userId: withdrawalRequest.userId,
      userName: user.userName,
      withdrawl: amount,
      deposite: 0,
      amount: user.avbalance,
      from: admin.userName,
      to: user.userName,
      remark: withdrawalRequest.remark || 'Transaction',
      invite: admin.code,
    });

    // Update admin and uplines
    await updateAdmin(adminId);
    await updateAllUplines(withdrawalRequest.userId);

    res.status(200).json({
      success: true,
      message: 'Withdrawal request approved successfully',
      data: withdrawalRequest,
    });
  } catch (error) {
    console.error('Error approving withdrawal request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve withdrawal request',
    });
  }
};

// Reject withdrawal request
export const rejectWithdrawalRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const adminId = req.id || req.user?.id || req.user?._id;
    const admin = await SubAdmin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    const withdrawalRequest = await WithdrawalRequest.findById(requestId);

    if (!withdrawalRequest) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found',
      });
    }

    if (withdrawalRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed',
      });
    }

    const { rejectionReason } = req.body;

    withdrawalRequest.status = 'rejected';
    withdrawalRequest.rejectedBy = admin.userName;
    withdrawalRequest.rejectionReason = rejectionReason || 'Rejected by admin';
    await withdrawalRequest.save();

    res.status(200).json({
      success: true,
      message: 'Withdrawal request rejected successfully',
      data: withdrawalRequest,
    });
  } catch (error) {
    console.error('Error rejecting withdrawal request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject withdrawal request',
    });
  }
};

// Get user's withdrawal history
export const getUserWithdrawalHistory = async (req, res) => {
  try {
    const userId = req.id || req.user?.id || req.user?._id;
    const { startDate, endDate, page = 1, limit = 100 } = req.query;

    const user = await SubAdmin.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const filter = { userName: user.userName };

    // Add date filtering if both dates are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Include all transactions on end date

      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const withdrawals = await WithdrawalHistory.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await WithdrawalHistory.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: withdrawals,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching withdrawal history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch withdrawal history',
    });
  }
};

// Get user's withdrawal requests
export const getUserWithdrawalRequests = async (req, res) => {
  try {
    const userId = req.id || req.user?.id || req.user?._id;
    const { startDate, endDate, page = 1, limit = 100 } = req.query;

    const filter = { userId: userId.toString() };

    // Add date filtering if both dates are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);

      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const requests = await WithdrawalRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await WithdrawalRequest.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch withdrawal requests',
    });
  }
};

// Cancel (abandon) withdrawal request
export const cancelWithdrawalRequest = async (req, res) => {
  try {
    const userId = req.id || req.user?.id || req.user?._id;
    const { requestId } = req.params;

    const withdrawalRequest = await WithdrawalRequest.findById(requestId);

    if (!withdrawalRequest) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found',
      });
    }

    // Only allow user to cancel their own requests
    if (withdrawalRequest.userId !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own requests',
      });
    }

    // Only allow cancellation of pending requests
    if (withdrawalRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be cancelled',
      });
    }

    withdrawalRequest.status = 'abandoned';
    await withdrawalRequest.save();

    res.status(200).json({
      success: true,
      message: 'Withdrawal request cancelled successfully',
      data: withdrawalRequest,
    });
  } catch (error) {
    console.error('Error cancelling withdrawal request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel withdrawal request',
    });
  }
};
