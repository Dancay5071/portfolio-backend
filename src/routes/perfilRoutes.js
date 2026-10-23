import {Router} from 'express';
import { getPerfil } from '../controllers/perfilController.js';

const perfilRoutes = Router();

perfilRoutes.get('/', getPerfil);

export default perfilRoutes;
