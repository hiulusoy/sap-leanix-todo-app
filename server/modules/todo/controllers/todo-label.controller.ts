import {Request, Response} from 'express';

import {sendErrorResponse, sendResponse} from '../../../utils/controller.util';
import TodoLabelService from "../services/todo-label.service";

class TodoLabelController {
    /**
     * @openapi
     * /todo-labels:
     *   get:
     *     summary: Retrieve all todo labels
     *     description: Fetches a list of all todo labels in the system
     *     responses:
     *       200:
     *         description: Successfully retrieved labels
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: number
     *                   name:
     *                     type: string
     *       500:
     *         description: Server error
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
    async getAll(req: Request, res: Response) {
        try {
            const labels = await TodoLabelService.getAll();
            sendResponse(res, labels);
        } catch (error) {
            sendErrorResponse(res, (error as Error).message, 500);
        }
    }

    /**
     * @openapi
     * /todo-labels:
     *   post:
     *     summary: Create a new todo label
     *     description: Adds a new label to the system
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the label
     *                 example: "Important"
     *             required:
     *               - name
     *     responses:
     *       200:
     *         description: Successfully created label
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: number
     *                 name:
     *                   type: string
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
     */
    async createLabel(req: Request, res: Response) {
        try {
            const {name} = req.body;
            if (!name) {
                sendErrorResponse(res, 'Name is required', 400);
                return;
            }
            const label = await TodoLabelService.createLabel(name);
            sendResponse(res, label, 201);
        } catch (error) {
            sendErrorResponse(res, (error as Error).message, 400);
        }
    }
}

export default new TodoLabelController();
