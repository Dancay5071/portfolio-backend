import{Router} from 'express';
import { getEducation } from '../controllers/educationController.js';

const educationRoutes = Router();

educationRoutes.get('/', getEducation);

export default educationRoutes;
