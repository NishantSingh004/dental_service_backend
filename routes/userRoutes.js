import express from 'express';
const router = express.Router();
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { addUser } from '../controllers/userController.js';

router.post('/add-user', authenticateAdmin, addUser);

export default router