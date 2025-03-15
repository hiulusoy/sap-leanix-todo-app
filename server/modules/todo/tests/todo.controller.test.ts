import request from 'supertest';
import TodoService from "../services/todo.service";
import {createTestServer} from "../../../test-server";
import TodoRoutes from "../routes/todo.routes";
import {TodoDto} from "../dto/todo.dto";
import {TodoState} from "../enums/todo-state.enum";

jest.mock('../services/todo.service');
const mockedTodoService = TodoService as jest.Mocked<typeof TodoService>;

jest.mock('../../../config/datasource', () => ({
    AppDataSource: {
        initialize: jest.fn().mockResolvedValue({}),
        getRepository: jest.fn()
    }
}));

const mockedTodo: TodoDto = {
    id: 1,
    title: 'Test Todo',
    state: TodoState.Pending,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
const app = createTestServer(TodoRoutes);

describe('TodoController', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should get all todos', async () => {
        mockedTodoService.getAll.mockResolvedValue([mockedTodo]);

        const res = await request(app).get('/');

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([mockedTodo]);
        expect(mockedTodoService.getAll).toHaveBeenCalled();
    });

    it('should return a todo by id', async () => {
        mockedTodoService.getById.mockResolvedValue(mockedTodo);

        const res = await request(app).get('/1');

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(mockedTodo);
        expect(mockedTodoService.getById).toHaveBeenCalledWith(1);
    });
});
