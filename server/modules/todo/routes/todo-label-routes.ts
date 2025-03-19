import { Router } from 'express';
import TodoLabelController from "../controllers/todo-label.controller";


const router = Router();

router.get('/', TodoLabelController.getAll);
router.post('/', TodoLabelController.createLabel);

export default router;
