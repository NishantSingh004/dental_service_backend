import express from 'express';
const router = express.Router();
import { User } from "../model/doctors.js";

import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { addUser } from '../controllers/userController.js';

router.post('/add-user', authenticateAdmin, addUser);
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});
export default router