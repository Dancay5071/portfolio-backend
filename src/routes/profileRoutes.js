import {Router} from 'express';
import { getProfile } from '../controllers/profileController.js';

const profileRoutes = Router();

profileRoutes.get('/', getProfile);

export default profileRoutes;
