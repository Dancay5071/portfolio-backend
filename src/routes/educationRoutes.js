import { Router } from 'express';
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation
} from '../controllers/educationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getEducation);
router.post('/', verifyToken, createEducation);
router.put('/:id', verifyToken, updateEducation);
router.delete('/:id', verifyToken, deleteEducation);

export default router;
