// modules/todo/todo.repository.ts
import { Repository } from 'typeorm';
import {AppDataSource} from "../../../config/datasource";
import {TodoEntity} from "../entity/todo.entity";
import {TodoState} from "../enums/todo-state.enum";



class TodoEntityRepository {
    private repo: Repository<TodoEntity>;

    constructor() {
        this.repo = AppDataSource.getRepository(TodoEntity);
    }

    async getAll(): Promise<TodoEntity[]> {
        return this.repo.find();
    }

    async getById(id: number): Promise<TodoEntity | null> {
        return this.repo.findOneBy({ id });
    }

    async create(todoData: Partial<TodoEntity>): Promise<TodoEntity> {
        const todo = this.repo.create(todoData);
        return this.repo.save(todo);
    }

    async update(id: number, todoData: Partial<TodoEntity>): Promise<TodoEntity | null> {
        await this.repo.update(id, todoData);
        return this.getById(id);
    }

    async toggle(id: number): Promise<TodoEntity | null> {
        const todo = await this.getById(id);
        if (!todo) return null;

        todo.state = (todo.state === TodoState.Pending)
            ? TodoState.Completed
            : TodoState.Pending;

        return this.repo.save(todo);
    }

    async delete(id: number): Promise<TodoEntity | null> {
        const todo = await this.getById(id);
        if (!todo) return null;
        todo.active = false; // Soft delete işlemi
        return this.repo.save(todo);
    }
}

export default new TodoEntityRepository();
