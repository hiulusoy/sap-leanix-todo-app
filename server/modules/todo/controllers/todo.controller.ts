// modules/todo/todo.controller.ts
import {Request, Response} from 'express';

import TodoService from "../services/todo.service";
import {sendErrorResponse, sendResponse} from "../../../utils/controller.util";
import OpenaiService from "../services/openai.service";

class TodoController {
    /**
     * @openapi
     * /todos:
     *   get:
     *     summary: Retrieve a list of todos
     *     responses:
     *       200:
     *         description: A list of todos.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Todo'
     */
    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const todos = await TodoService.getAll();
            sendResponse(res, todos); // totalCount otomatik belirlenecek
        } catch (error) {
            sendErrorResponse(res, (error as Error).message, 500);
        }
    };

    /**
     * @openapi
     * /todos/{id}:
     *   get:
     *     summary: Retrieve a single todo by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *     responses:
     *       200:
     *         description: A single todo item.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Todo'
     *       404:
     *         description: Todo not found.
     */
    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const todo = await TodoService.getById(id);
            if (!todo) {
                sendErrorResponse(res, 'Todo not found', 404);
                return;
            }
            sendResponse(res, todo);
        } catch (error) {
            sendErrorResponse(res, (error as Error).message, 500);
        }
    };

    /**
     * @openapi
     * /todos:
     *   post:
     *     summary: Create a new todo
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Todo'
     *     responses:
     *       201:
     *         description: Todo created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Todo'
     *       400:
     *         description: Bad request.
     */
    createTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const todoData = req.body;
            const todo = await TodoService.create(todoData);
            sendResponse(res, todo, 1); // Yeni kayıt, totalCount = 1
        } catch (error) {
            sendErrorResponse(res, (error as Error).message, 400);
        }
    };

    /**
     * @openapi
     * /todos/{id}:
     *   put:
     *     summary: Update an existing todo
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Todo'
     *     responses:
     *       200:
     *         description: Todo updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Todo'
     *       404:
     *         description: Todo not found.
     *       400:
     *         description: Bad request.
     */

    updateTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const todoData = req.body;

            console.log(`Updating todo ${id} with data:`, JSON.stringify(todoData));

            const todo = await TodoService.update(id, todoData);

            if (!todo) {
                sendErrorResponse(res, 'Todo not found', 404);
                return;
            }

            console.log(`Todo ${id} updated successfully:`, JSON.stringify(todo));

            sendResponse(res, todo);
        } catch (error) {
            console.error(`Error updating todo:`, error);
            sendErrorResponse(res, (error as Error).message, 400);
        }
    };

    /**
     * @openapi
     * /todos/{id}/toggle:
     *   patch:
     *     summary: Toggle the completion status of a todo
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *     responses:
     *       200:
     *         description: Todo toggled successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Todo'
     *       404:
     *         description: Todo not found.
     *       400:
     *         description: Bad request.
     */
    toggleTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const todo = await TodoService.toggle(id);
            if (!todo) {
                sendErrorResponse(res, 'Todo not found', 404);
                return;
            }
            sendResponse(res, todo);
        } catch (error) {
            sendErrorResponse(res, (error as Error).message, 400);
        }
    };

    /**
     * @openapi
     * /todos/{id}:
     *   delete:
     *     summary: Delete a todo by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *     responses:
     *       200:
     *         description: Todo deleted successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       404:
     *         description: Todo not found.
     *       500:
     *         description: Server error.
     */
    deleteTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const todo = await TodoService.delete(id);
            if (!todo) {
                sendErrorResponse(res, 'Todo not found', 404);
                return;
            }
            sendResponse(res, {message: 'Todo deleted'}, 1);
        } catch (error) {
            sendErrorResponse(res, (error as Error).message, 500);
        }
    };

    /**
     * @openapi
     * /todos/{id}/order:
     *   patch:
     *     summary: Update the order of a todo
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               order:
     *                 type: number
     *             required:
     *               - order
     *     responses:
     *       200:
     *         description: Todo order updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Todo'
     *       404:
     *         description: Todo not found.
     *       400:
     *         description: Bad request.
     */
    updateTodoOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const {order} = req.body;

            if (typeof order !== 'number') {
                sendErrorResponse(res, 'Order must be a number', 400);
                return;
            }

            const todo = await TodoService.updateOrder(id, order);
            if (!todo) {
                sendErrorResponse(res, 'Todo not found', 404);
                return;
            }
            sendResponse(res, todo);
        } catch (error) {
            sendErrorResponse(res, (error as Error).message, 400);
        }
    };

    /**
     * @openapi
     * /todos/batch-update-orders:
     *   post:
     *     summary: Update orders of multiple todos in batch
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               updates:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: number
     *                     order:
     *                       type: number
     *                   required:
     *                     - id
     *                     - order
     *             required:
     *               - updates
     *     responses:
     *       200:
     *         description: Todo orders updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       400:
     *         description: Bad request.
     */
    batchUpdateTodoOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            const {updates} = req.body;

            if (!Array.isArray(updates)) {
                sendErrorResponse(res, 'Updates must be an array', 400);
                return;
            }

            await TodoService.batchUpdateOrders(updates);
            sendResponse(res, {message: 'Todo orders updated successfully'});
        } catch (error) {
            sendErrorResponse(res, (error as Error).message, 400);
        }
    };


    /**
     * @openapi
     * /todos/generate-description:
     *   post:
     *     summary: Generate a description for a todo item using AI
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *                 description: Title of the todo item
     *                 example: "Prepare quarterly report"
     *             required:
     *               - title
     *     responses:
     *       200:
     *         description: Successfully generated description
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 description:
     *                   type: string
     *                   description: AI-generated description for the todo item
     *                 generatedAt:
     *                   type: string
     *                   format: date-time
     *                   description: Timestamp of description generation
     *       400:
     *         description: Bad request - Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 errors:
     *                   type: array
     *                   items:
     *                     type: string
     *       500:
     *         description: Server error during description generation
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 errors:
     *                   type: array
     *                   items:
     *                     type: string
     */
    async generateDescription(req: Request, res: Response): Promise<void> {
        try {
            const input = req.body;

            if (!input.title) {
                sendErrorResponse(res, 'Title is required');
                return;
            }

            const description = await OpenaiService.generateDescription(input);

            sendResponse(res, description);
        } catch (error) {
            console.error('Description generation error:', error);
            sendErrorResponse(res, (error as Error).message, 500);
        }
    }

}

export default new TodoController();
