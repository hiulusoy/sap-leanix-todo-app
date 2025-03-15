// modules/todo/todo.controller.ts
import {Request, Response} from 'express';

import TodoService from "../services/todo.service";
import {sendErrorResponse, sendResponse} from "../../../utils/controller.util";

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
            const todo = await TodoService.update(id, todoData);
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
}

export default new TodoController();
