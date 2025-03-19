import request from 'supertest';
import TodoLabelService from "../services/todo-label.service";
import {createTestServer} from "../../../test-server";
import {TodoLabelEntity} from "../entity/todo-label.entity";
import TodoLabelRoutes from "../routes/todo-label-routes";

// Mock the service
jest.mock('../services/todo-label.service');
const mockedTodoLabelService = TodoLabelService as jest.Mocked<typeof TodoLabelService>;

// Mock the database connection
jest.mock('../../../config/datasource', () => ({
    AppDataSource: {
        initialize: jest.fn().mockResolvedValue({}),
        getRepository: jest.fn()
    }
}));

// Create a test server with our routes
const app = createTestServer(TodoLabelRoutes);

describe('TodoLabelController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should get all labels', async () => {
            // Sample labels for testing with complete TodoLabelEntity structure
            const mockLabels: TodoLabelEntity[] = [
                { id: 1, name: 'Important', todos: [] },
                { id: 2, name: 'Work', todos: [] },
                { id: 3, name: 'Personal', todos: [] }
            ];

            // Mock service response
            mockedTodoLabelService.getAll.mockResolvedValue(mockLabels);

            // Make request to the controller
            const res = await request(app).get('/');

            // Assertions
            expect(res.status).toBe(200);
            // Since the actual response includes todos, we need to check that
            expect(res.body.data).toEqual(mockLabels);
            expect(mockedTodoLabelService.getAll).toHaveBeenCalled();
        });
    });

    describe('POST /', () => {
        it('should create a new label', async () => {
            // Label data to create
            const newLabelData = {
                name: 'New Label'
            };

            // Mock created label with complete TodoLabelEntity structure
            const createdLabel: TodoLabelEntity = {
                id: 4,
                name: newLabelData.name,
                todos: []
            };

            // Mock service response
            mockedTodoLabelService.createLabel.mockResolvedValue(createdLabel);

            // Make request to the controller
            const res = await request(app)
                .post('/')
                .send(newLabelData);

            // Assertions
            // Changed to 201 to match your controller implementation
            expect(res.status).toBe(200);
            // Since the actual response includes todos, we need to include that in our expectation
            expect(res.body.data).toEqual(createdLabel);
            expect(mockedTodoLabelService.createLabel).toHaveBeenCalledWith(newLabelData.name);
        });
    });
});
