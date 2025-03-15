import {TodoDto} from "../dto/todo.dto";
import {TodoEntity} from "../entity/todo.entity";
import {mapTodoToDTO} from "../mappers/todo.mapper";
import TodoRepository from "../repositories/todo.repository";

class TodoService {
    async getAll(): Promise<TodoDto[]> {
        const todos: TodoEntity[] = await TodoRepository.getAll();
        return todos.map(mapTodoToDTO);
    }

    async getById(id: number): Promise<TodoDto | null> {
        const todo: TodoEntity | null = await TodoRepository.getById(id);
        return todo ? mapTodoToDTO(todo) : null;
    }

    async create(todoData: Partial<TodoEntity>): Promise<TodoDto> {
        const todo: TodoEntity = await TodoRepository.create(todoData);
        return mapTodoToDTO(todo);
    }

    async update(id: number, todoData: Partial<TodoEntity>): Promise<TodoDto | null> {
        const updatedTodo: TodoEntity | null = await TodoRepository.update(id, todoData);
        return updatedTodo ? mapTodoToDTO(updatedTodo) : null;
    }

    async toggle(id: number): Promise<TodoDto | null> {
        const toggledTodo: TodoEntity | null = await TodoRepository.toggle(id);
        return toggledTodo ? mapTodoToDTO(toggledTodo) : null;
    }

    async delete(id: number): Promise<TodoDto | null> {
        const deletedTodo: TodoEntity | null = await TodoRepository.delete(id);
        return deletedTodo ? mapTodoToDTO(deletedTodo) : null;
    }
}

export default new TodoService();
