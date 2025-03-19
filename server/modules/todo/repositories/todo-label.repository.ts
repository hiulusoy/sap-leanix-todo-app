import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/datasource';
import { TodoLabelEntity } from '../entity/todo-label.entity';

class TodoLabelRepository {
    private repo: Repository<TodoLabelEntity>;

    constructor() {
        this.repo = AppDataSource.getRepository(TodoLabelEntity);
    }

    async getAll(): Promise<TodoLabelEntity[]> {
        return this.repo.find();
    }

    async getById(id: number): Promise<TodoLabelEntity | null> {
        return this.repo.findOneBy({ id }) ?? null;
    }

    async getByName(name: string): Promise<TodoLabelEntity | null> {
        return this.repo.findOneBy({ name }) ?? null;
    }

    async createLabel(labelData: Partial<TodoLabelEntity>): Promise<TodoLabelEntity> {
        const label = this.repo.create(labelData);
        return this.repo.save(label);
    }

    async updateLabel(id: number, labelData: Partial<TodoLabelEntity>): Promise<TodoLabelEntity | null> {
        await this.repo.update(id, labelData);
        return this.getById(id);
    }

    async deleteLabel(id: number): Promise<TodoLabelEntity | null> {
        const label = await this.getById(id);
        if (!label) return null;
        await this.repo.remove(label);
        return label;
    }

    /**
     * findOrCreateByName - Yardımcı metod:
     * Eğer 'name' yoksa yeni kaydı oluşturur, varsa bulur döndürür.
     */
    async findOrCreateByName(name: string): Promise<TodoLabelEntity> {
        let label = await this.getByName(name);
        if (!label) {
            label = this.repo.create({ name });
            label = await this.repo.save(label);
        }
        return label;
    }

    async findByName(name: string): Promise<TodoLabelEntity | null> {
        return this.repo.findOne({
            where: { name }
        });
    }

    async create(labelData: Partial<TodoLabelEntity>): Promise<TodoLabelEntity> {
        const label = this.repo.create(labelData);
        return this.repo.save(label);
    }
}

export default new TodoLabelRepository();
