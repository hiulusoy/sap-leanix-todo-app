import request from 'supertest';
import TodoService from "../services/todo.service";
import OpenaiService from "../services/openai.service";
import {createTestServer} from "../../../test-server";
import TodoRoutes from "../routes/todo.routes";
import {TodoDto} from "../dto/todo.dto";
import {TodoPriority} from "../enums/todo-priority.enum";
import {TodoState} from "../enums/todo-state.enum";
import {TodoEntity} from "../entity/todo.entity";

// Mock the services
jest.mock('../services/todo.service');
jest.mock('../services/openai.service');
const mockedTodoService = TodoService as jest.Mocked<typeof TodoService>;
const mockedOpenaiService = OpenaiService as jest.Mocked<typeof OpenaiService>;

// Mock the database connection
jest.mock('../../../config/datasource', () => ({
    AppDataSource: {
        initialize: jest.fn().mockResolvedValue({}),
        getRepository: jest.fn()
    }
}));

// Sample todo data for testing
const mockedTodo: TodoDto = {
    id: 1,
    title: 'Test Todo',
    description: 'Test description',
    state: 'pending',
    active: true,
    priority: TodoPriority.Medium,
    labels: ['Test'],
    hasDueDate: false,
    createdBy: 'test@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

// Create a test server with our routes
const app = createTestServer(TodoRoutes);

describe('TodoController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should get all todos', async () => {
            mockedTodoService.getAll.mockResolvedValue([mockedTodo]);

            const res = await request(app).get('/');

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual([mockedTodo]);
            expect(mockedTodoService.getAll).toHaveBeenCalled();
        });
    });

    describe('GET /:id', () => {
        it('should return a todo by id', async () => {
            mockedTodoService.getById.mockResolvedValue(mockedTodo);

            const res = await request(app).get('/1');

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual(mockedTodo);
            expect(mockedTodoService.getById).toHaveBeenCalledWith(1);
        });
    });

    describe('POST /', () => {
        // For input data, we'll mock what a user would actually submit
        const newTodoInput = {
            title: 'New Todo',
            description: 'New description',
            state: TodoState.Pending,
            priority: TodoPriority.Medium,
            labels: ['Test'],
            order: 1
        };

        it('should create a new todo', async () => {
            // Create a properly typed mock return value that matches TodoEntity
            const mockEntityReturn: TodoEntity = {
                id: 1,
                title: newTodoInput.title,
                description: newTodoInput.description,
                state: TodoState.Pending,
                priority: TodoPriority.Medium,
                active: true,
                hasDueDate: false,
                order: newTodoInput.order,
                labels: [], // Empty array for entity return
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Using mockResolvedValue with the correct entity type
            mockedTodoService.create.mockResolvedValue(mockEntityReturn);

            const res = await request(app)
                .post('/')
                .send(newTodoInput);

            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
            expect(mockedTodoService.create).toHaveBeenCalled();
        });
    });


    describe('PUT /:id', () => {
        const updateData = {
            title: 'Updated Todo',
            description: 'Updated description'
        };

        it('should update an existing todo', async () => {
            const updatedTodo = {...mockedTodo, ...updateData};
            mockedTodoService.update.mockResolvedValue(updatedTodo);

            const res = await request(app)
                .put('/1')
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual(updatedTodo);
            expect(mockedTodoService.update).toHaveBeenCalledWith(1, updateData);
        });
    });

    describe('PATCH /:id/toggle', () => {
        it('should toggle a todo state', async () => {
            // Use the explicit string literal type 'completed' instead of string type
            const toggledTodo = {...mockedTodo, state: 'completed' as 'pending' | 'completed'};
            mockedTodoService.toggle.mockResolvedValue(toggledTodo);

            const res = await request(app).patch('/1/toggle');

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual(toggledTodo);
            expect(mockedTodoService.toggle).toHaveBeenCalledWith(1);
        });
    });

    describe('DELETE /:id', () => {
        it('should delete a todo', async () => {
            mockedTodoService.delete.mockResolvedValue(mockedTodo);

            const res = await request(app).delete('/1');

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual({message: 'Todo deleted'});
            expect(mockedTodoService.delete).toHaveBeenCalledWith(1);
        });

    });

    describe('PATCH /:id/order', () => {
        it('should update todo order', async () => {
            // Since 'order' is not in TodoDto but in TodoEntity, we expect the service to handle the conversion
            const updatedTodo = {...mockedTodo}; // Return without order property as it's not in the DTO
            mockedTodoService.updateOrder.mockResolvedValue(updatedTodo);

            const res = await request(app)
                .patch('/1/order')
                .send({order: 2});

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual(updatedTodo);
            expect(mockedTodoService.updateOrder).toHaveBeenCalledWith(1, 2);
        });

    });

    describe('POST /batch-update-orders', () => {
        const orderUpdates = {
            updates: [
                {id: 1, order: 3},
                {id: 2, order: 1},
                {id: 3, order: 2}
            ]
        };

        it('should update multiple todo orders in batch', async () => {
            mockedTodoService.batchUpdateOrders.mockResolvedValue();

            const res = await request(app)
                .post('/batch-update-orders')
                .send(orderUpdates);

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual({message: 'Todo orders updated successfully'});
            expect(mockedTodoService.batchUpdateOrders).toHaveBeenCalledWith(orderUpdates.updates);
        });

    });

    describe('POST /generate-description', () => {
        const titleData = {
            title: 'Prepare quarterly report'
        };

        // According to the error, OpenaiService.generateDescription should return a string, not an object
        const generatedDescription = 'Comprehensive quarterly financial report with analysis of revenue, expenses, and profit margins.';

        it('should generate a description using AI', async () => {
            mockedOpenaiService.generateDescription.mockResolvedValue(generatedDescription);

            const res = await request(app)
                .post('/generate-description')
                .send(titleData);

            expect(res.status).toBe(200);
            expect(res.body.data).toBe(generatedDescription);
            expect(mockedOpenaiService.generateDescription).toHaveBeenCalledWith(titleData);
        });
    });
});
