import DepositRequest from '../models/depositRequestModel.js';
import SubAdmin from '../models/subAdminModel.js';
import DepositHistory from '../models/depositeHistoryModel.js';
import TransactionHistory from '../models/transtionHistoryModel.js';
import { updateAdmin, updateAllUplines } from './admin/subAdminController.js';

// Create deposit request
export const createDepositRequest = async (req, res) => {
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
      referenceId,
      paymentMethod,
      bonusType,
      image,
      remark,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    if (!paymentType) {
      return res.status(400).json({
        success: false,
        message: 'Payment type is required',
      });
    }

    const depositRequest = new DepositRequest({
      userId: userId.toString(),
      userName: user.userName,
      amount,
      paymentType,
      option,
      referenceId,
      paymentMethod,
      bonusType,
      image,
      remark,
      status: 'pending',
    });

    await depositRequest.save();

    res.status(201).json({
      success: true,
      message: 'Deposit request created successfully',
      data: depositRequest,
    });
  } catch (error) {
    console.error('Error creating deposit request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create deposit request',
    });
  }
};

// Get all deposit requests (for admin)
export const getDepositRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const requests = await DepositRequest.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching deposit requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch deposit requests',
    });
  }
};

// Approve deposit request
export const approveDepositRequest = async (req, res) => {
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

    const depositRequest = await DepositRequest.findById(requestId);

    if (!depositRequest) {
      return res.status(404).json({
        success: false,
        message: 'Deposit request not found',
      });
    }

    if (depositRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed',
      });
    }

    const user = await SubAdmin.findById(depositRequest.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { amount } = depositRequest;
    const role = admin.role;

    // Update user balance
    if (role === 'supperadmin') {
      // Super Admin can deposit without balance restriction
      user.balance += amount;
      user.avbalance += amount;
      user.baseBalance += amount;
    } else {
      // Normal admin deposits from their own balance
      if (admin.balance < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance',
        });
      }
      user.balance += amount;
      user.avbalance += amount;
      user.baseBalance += amount;
      admin.balance -= amount;
      admin.baseBalance -= amount;
      admin.avbalance = Math.max(0, admin.avbalance - amount);
      await admin.save();
    }

    // Recalculate creditReferenceProfitLoss
    user.creditReferenceProfitLoss = user.baseBalance - user.creditReference;
    await user.save();

    // Update deposit request status
    depositRequest.status = 'approved';
    depositRequest.approvedBy = admin.userName;
    await depositRequest.save();

    // Create deposit history
    await DepositHistory.create({
      userName: user.userName,
      amount: amount,
      remark: depositRequest.remark || 'Deposit',
      invite: admin.code,
    });

    // Create transaction history
    await TransactionHistory.create({
      userId: depositRequest.userId,
      userName: user.userName,
      withdrawl: 0,
      deposite: amount,
      amount: user.avbalance,
      remark: depositRequest.remark || 'Transaction',
      from: admin.userName,
      to: user.userName,
      invite: admin.code,
    });

    // Update admin and uplines
    await updateAdmin(adminId);
    await updateAllUplines(depositRequest.userId);

    res.status(200).json({
      success: true,
      message: 'Deposit request approved successfully',
      data: depositRequest,
    });
  } catch (error) {
    console.error('Error approving deposit request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve deposit request',
    });
  }
};

// Reject deposit request
export const rejectDepositRequest = async (req, res) => {
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

    const depositRequest = await DepositRequest.findById(requestId);

    if (!depositRequest) {
      return res.status(404).json({
        success: false,
        message: 'Deposit request not found',
      });
    }

    if (depositRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed',
      });
    }

    const { rejectionReason } = req.body;

    depositRequest.status = 'rejected';
    depositRequest.rejectedBy = admin.userName;
    depositRequest.rejectionReason = rejectionReason || 'Rejected by admin';
    await depositRequest.save();

    res.status(200).json({
      success: true,
      message: 'Deposit request rejected successfully',
      data: depositRequest,
    });
  } catch (error) {
    console.error('Error rejecting deposit request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject deposit request',
    });
  }
};

// Get user's deposit history
export const getUserDepositHistory = async (req, res) => {
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

    const deposits = await DepositHistory.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await DepositHistory.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: deposits,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching deposit history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch deposit history',
    });
  }
};

// Get user's deposit requests
export const getUserDepositRequests = async (req, res) => {
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

    const requests = await DepositRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await DepositRequest.countDocuments(filter);

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
    console.error('Error fetching deposit requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch deposit requests',
    });
  }
};

// Cancel (abandon) deposit request
export const cancelDepositRequest = async (req, res) => {
  try {
    const userId = req.id || req.user?.id || req.user?._id;
    const { requestId } = req.params;

    const depositRequest = await DepositRequest.findById(requestId);

    if (!depositRequest) {
      return res.status(404).json({
        success: false,
        message: 'Deposit request not found',
      });
    }

    // Only allow user to cancel their own requests
    if (depositRequest.userId !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own requests',
      });
    }

    // Only allow cancellation of pending requests
    if (depositRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be cancelled',
      });
    }

    depositRequest.status = 'abandoned';
    await depositRequest.save();

    res.status(200).json({
      success: true,
      message: 'Deposit request cancelled successfully',
      data: depositRequest,
    });
  } catch (error) {
    console.error('Error cancelling deposit request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel deposit request',
    });
  }
};
