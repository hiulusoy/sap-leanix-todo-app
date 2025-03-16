import { Router } from 'express';
import TodoRoutes from "./modules/todo/routes/todo.routes";

const router = Router();

router.use('/todos', TodoRoutes);

export default router;
