import { Router } from 'express';
import TodoController from "../controllers/todo.controller";


const router = Router();

router.get('/', TodoController.getAll);
router.get('/:id', TodoController.getById);
router.post('/', TodoController.createTodo);
router.put('/:id', TodoController.updateTodo);
router.patch('/:id/toggle', TodoController.toggleTodo);
router.delete('/:id', TodoController.deleteTodo);

export default router;
