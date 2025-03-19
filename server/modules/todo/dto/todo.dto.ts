import {TodoPriority} from "../enums/todo-priority.enum";

/**
 * @openapi
 * components:
 *   schemas:
 *     TodoDto:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the todo item
 *           example: 1
 *         title:
 *           type: string
 *           description: Title of the todo item
 *           example: "Complete project report"
 *         state:
 *           type: string
 *           enum: ['pending', 'completed']
 *           description: Current state of the todo item
 *           example: "pending"
 *         active:
 *           type: boolean
 *           description: Indicates if the todo item is active
 *           example: true
 *         description:
 *           type: string
 *           description: Detailed description of the todo item
 *           example: "Prepare quarterly financial report"
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *           description: List of labels associated with the todo item
 *           example: ["Finance", "Quarterly"]
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date of the todo item
 *           example: "2024-03-19T10:00:00Z"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Due date of the todo item
 *           example: "2024-03-25T17:00:00Z"
 *         priority:
 *           type: string
 *           enum: ['Low', 'Medium', 'High']
 *           description: Priority level of the todo item
 *           example: "Medium"
 *         hasDueDate:
 *           type: boolean
 *           description: Indicates if the todo item has a due date
 *           example: true
 *         createdBy:
 *           type: string
 *           description: User who created the todo item
 *           example: "john.doe@example.com"
 *         updatedBy:
 *           type: string
 *           description: User who last updated the todo item
 *           example: "jane.smith@example.com"
 *         order:
 *           type: number
 *           description: Order position of the todo item
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of todo item creation
 *           example: "2024-03-19T09:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update to the todo item
 *           example: "2024-03-19T10:30:00Z"
 *       required:
 *         - id
 *         - title
 *         - state
 *         - active
 *         - createdAt
 *         - updatedAt
 */
export interface TodoDto {
    id: number;
    title: string;
    state: 'pending' | 'completed';
    active: boolean;
    description?: string;
    labels?: string[];
    startDate?: Date;
    dueDate?: Date;
    priority?: TodoPriority;
    hasDueDate?: boolean;
    createdBy?: string;
    updatedBy?: string;
    order?: number;
    createdAt: string;
    updatedAt: string;
}
