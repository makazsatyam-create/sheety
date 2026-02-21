import mongoose from 'mongoose';

const withdrawalRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['bank', 'crypto'],
      required: true,
    },
    option: {
      type: String,
      enum: ['option1', 'option2', 'option3'],
    },
    // Bank details
    accountNumber: {
      type: String,
      trim: true,
    },
    accountHolderName: {
      type: String,
      trim: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    branchName: {
      type: String,
      trim: true,
    },
    ifscCode: {
      type: String,
      trim: true,
    },
    // Crypto details
    currency: {
      type: String,
      trim: true,
    },
    walletAddress: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'abandoned'],
      default: 'pending',
    },
    remark: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: String,
      trim: true,
    },
    rejectedBy: {
      type: String,
      trim: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);

export default WithdrawalRequest;
