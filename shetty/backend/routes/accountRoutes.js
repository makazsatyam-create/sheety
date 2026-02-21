import express from 'express';
import {
  addAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  getPublicAccounts,
} from '../controllers/accountController.js';
import { adminAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public endpoint for client to fetch accounts
router.get('/account/public/list', getPublicAccounts);

// Admin endpoints (require authentication)
router.post('/account/add', adminAuthMiddleware, addAccount);
router.get('/account/list', adminAuthMiddleware, getAccounts);
router.get('/account/:id', adminAuthMiddleware, getAccountById);
router.put('/account/:id', adminAuthMiddleware, updateAccount);
router.delete('/account/:id', adminAuthMiddleware, deleteAccount);

export default router;
