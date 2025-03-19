import { Router } from 'express';
import TodoRoutes from "./modules/todo/routes/todo.routes";
import TodoLabelRoutes from "./modules/todo/routes/todo-label-routes";

const router = Router();

router.use('/todos', TodoRoutes);
router.use('/labels', TodoLabelRoutes);

export default router;
