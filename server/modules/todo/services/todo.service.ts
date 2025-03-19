import {TodoDto} from "../dto/todo.dto";
import {TodoEntity} from "../entity/todo.entity";
import TodoRepository from "../repositories/todo.repository";
import {mapTodoToDTO} from "../mappers/todo.mapper";
import TodoLabelService from "./todo-label.service";
import {TodoLabelEntity} from "../entity/todo-label.entity";
import TodoLabelRepository from "../repositories/todo-label.repository";

class TodoService {
    /**
     * Retrieves all todo items from the repository
     * @returns Promise resolving to an array of TodoDto objects
     */
    async getAll(): Promise<TodoDto[]> {
        const todos: TodoEntity[] = await TodoRepository.getAll();
        return todos.map(mapTodoToDTO);
    }

    /**
     * Retrieves a specific todo item by its ID
     * @param id Unique identifier of the todo item
     * @returns Promise resolving to a TodoDto or null if not found
     */
    async getById(id: number): Promise<TodoDto | null> {
        const todo: TodoEntity | null = await TodoRepository.getById(id);
        return todo ? mapTodoToDTO(todo) : null;
    }

    /**
     * Creates a new todo item with optional labels
     * @param todoData Partial todo item data
     * @returns Promise resolving to the created TodoEntity
     */
    async create(todoData: Partial<TodoEntity>): Promise<TodoEntity> {
        if (Array.isArray(todoData.labels)) {
            const labelNames = todoData.labels as unknown as string[];
            todoData.labels = await TodoLabelService.resolveLabelsByNames(labelNames);
        } else {
            todoData.labels = [];
        }

        return await TodoRepository.create(todoData);
    }

    /**
     * Updates an existing todo item, including its labels
     * @param id ID of the todo item to update
     * @param todoData Updated todo item data
     * @returns Promise resolving to updated TodoDto or null if not found
     */
    async update(id: number, todoData: any): Promise<TodoDto | null> {
        try {
            const labelNames = todoData.labels || [];
            delete todoData.labels;

            const existingTodo = await TodoRepository.getById(id);
            if (!existingTodo) {
                return null;
            }

            Object.assign(existingTodo, todoData);

            const labelEntities: TodoLabelEntity[] = [];

            for (const name of labelNames) {
                if (typeof name === 'string') {
                    let label = await TodoLabelRepository.findByName(name);
                    if (!label) {
                        label = await TodoLabelRepository.create({name});
                    }
                    labelEntities.push(label);
                }
            }

            existingTodo.labels = labelEntities;

            const updatedTodo = await TodoRepository.save(existingTodo);

            return mapTodoToDTO(updatedTodo);
        } catch (error) {
            console.error(`Error updating todo: ${error}`);
            throw error;
        }
    }

    /**
     * Toggles the completion status of a todo item
     * @param id ID of the todo item to toggle
     * @returns Promise resolving to updated TodoDto or null if not found
     */
    async toggle(id: number): Promise<TodoDto | null> {
        const toggledTodo: TodoEntity | null = await TodoRepository.toggle(id);
        return toggledTodo ? mapTodoToDTO(toggledTodo) : null;
    }

    /**
     * Deletes a todo item
     * @param id ID of the todo item to delete
     * @returns Promise resolving to deleted TodoDto or null if not found
     */
    async delete(id: number): Promise<TodoDto | null> {
        const deletedTodo: TodoEntity | null = await TodoRepository.delete(id);
        return deletedTodo ? mapTodoToDTO(deletedTodo) : null;
    }

    /**
     * Updates the order of a single todo item
     * @param id ID of the todo item
     * @param order New order value for the todo item
     * @returns Promise resolving to updated TodoDto or null if not found
     */
    async updateOrder(id: number, order: number): Promise<TodoDto | null> {
        const updatedTodo: TodoEntity | null = await TodoRepository.updateOrder(id, order);
        return updatedTodo ? mapTodoToDTO(updatedTodo) : null;
    }

    /**
     * Updates orders of multiple todo items simultaneously
     * @param updates Array of objects containing todo item IDs and their new order values
     */
    async batchUpdateOrders(updates: { id: number; order: number }[]): Promise<void> {
        await TodoRepository.batchUpdateOrders(updates);
    }
}

export default new TodoService();
