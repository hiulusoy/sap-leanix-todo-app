import { Router } from 'express';
import TodoController from "../controllers/todo.controller";


const router = Router();

router.get('/', TodoController.getAll);
router.get('/:id', TodoController.getById);
router.post('/', TodoController.createTodo);
router.put('/:id', TodoController.updateTodo);
router.patch('/:id/toggle', TodoController.toggleTodo);
router.delete('/:id', TodoController.deleteTodo);

router.patch('/:id/order', TodoController.updateTodoOrder);

router.post('/batch-update-orders', TodoController.batchUpdateTodoOrders);

router.post('/generate-description', TodoController.generateDescription);

export default router;
