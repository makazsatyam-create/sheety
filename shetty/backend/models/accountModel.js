import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['bank', 'upi', 'crypto'],
      required: true,
    },
    option: {
      type: String,
      enum: ['option1', 'option2', 'option3'],
      default: 'option1',
    },
    // Bank fields
    accountNumber: {
      type: String,
    },
    accountHolder: {
      type: String,
    },
    bankName: {
      type: String,
    },
    branchName: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    // UPI fields
    qrCode: {
      type: String,
    },
    upiId: {
      type: String,
    },
    // Crypto fields
    currency: {
      type: String,
    },
    walletAddress: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subadmin',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const AccountModel = mongoose.model('account', accountSchema);

export default AccountModel;
