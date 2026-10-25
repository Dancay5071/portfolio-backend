import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const profileRoutes = Router();

profileRoutes.get('/', getProfile);
profileRoutes.put('/', verifyToken, updateProfile);

export default profileRoutes;
