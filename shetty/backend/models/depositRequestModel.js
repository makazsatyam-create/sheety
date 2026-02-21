import mongoose from 'mongoose';

const depositRequestSchema = new mongoose.Schema(
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
      enum: ['bank', 'upi', 'crypto', 'whatsapp'],
      required: true,
    },
    option: {
      type: String,
      enum: ['option1', 'option2', 'option3'],
    },
    referenceId: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ['IMPS', 'NEFT', 'RTGS'],
    },
    bonusType: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL or base64 string
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

const DepositRequest = mongoose.model('DepositRequest', depositRequestSchema);

export default DepositRequest;
