import { Repository } from 'typeorm';
import { AppDataSource } from "../../../config/datasource";
import { TodoEntity } from "../entity/todo.entity";
import { TodoState } from "../enums/todo-state.enum";

class TodoEntityRepository {
    private repo: Repository<TodoEntity>;

    constructor() {
        this.repo = AppDataSource.getRepository(TodoEntity);
    }

    async getAll(): Promise<TodoEntity[]> {
        return this.repo.find({
            where: { active: true },
            relations: ['labels'],
            order: {
                order: 'ASC'
            }
        });
    }

    async getById(id: number): Promise<TodoEntity | null> {
        return this.repo.findOne({
            where: { id, active: true },
            relations: ['labels']
        });
    }

    async create(todoData: Partial<TodoEntity>): Promise<TodoEntity> {
        const todo = this.repo.create(todoData);
        return this.repo.save(todo);
    }

    async update(id: number, todoData: Partial<TodoEntity>): Promise<TodoEntity | null> {
        await this.repo.update(id, todoData);
        return this.getById(id);
    }

    async save(todo: TodoEntity): Promise<TodoEntity> {
        return this.repo.save(todo);
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
        todo.active = false; // Soft delete operation
        return this.repo.save(todo);
    }

    /**
     * Updates the order of a single todo.
     * @param id
     * @param order
     */
    async updateOrder(id: number, order: number): Promise<TodoEntity | null> {
        const todo = await this.getById(id);
        if (!todo) return null;

        todo.order = order;
        return this.repo.save(todo);
    }

    /**
     * Updates orders of multiple todos in a transaction.
     * @param updates Array of {id, order} objects
     */
    async batchUpdateOrders(updates: { id: number; order: number }[]): Promise<void> {
        await AppDataSource.transaction(async transactionalEntityManager => {
            for (const update of updates) {
                await transactionalEntityManager
                    .createQueryBuilder()
                    .update(TodoEntity)
                    .set({ order: update.order })
                    .where("id = :id AND active = :active", { id: update.id, active: true })
                    .execute();
            }
        });
    }
}

export default new TodoEntityRepository();
