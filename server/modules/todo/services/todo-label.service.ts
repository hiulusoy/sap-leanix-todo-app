import {TodoLabelEntity} from '../entity/todo-label.entity';
import TodoLabelRepository from "../repositories/todo-label.repository";

class LabelService {
    /**
     * Retrieves all todo labels from the repository
     * @returns Promise resolving to an array of TodoLabelEntity objects
     */
    async getAll(): Promise<TodoLabelEntity[]> {
        return TodoLabelRepository.getAll();
    }

    /**
     * Retrieves a specific todo label by its ID
     * @param id Unique identifier of the todo label
     * @returns Promise resolving to a TodoLabelEntity or null if not found
     */
    async getById(id: number): Promise<TodoLabelEntity | null> {
        return TodoLabelRepository.getById(id);
    }

    /**
     * Creates a new todo label or returns existing label if it already exists
     * @param name Name of the label to create
     * @returns Promise resolving to the created or existing TodoLabelEntity
     */
    async createLabel(name: string): Promise<TodoLabelEntity> {
        return TodoLabelRepository.findOrCreateByName(name);
    }

    /**
     * Updates an existing todo label
     * @param id ID of the label to update
     * @param labelData Partial data to update the label with
     * @returns Promise resolving to the updated TodoLabelEntity or null if not found
     */
    async updateLabel(id: number, labelData: Partial<TodoLabelEntity>): Promise<TodoLabelEntity | null> {
        return TodoLabelRepository.updateLabel(id, labelData);
    }

    /**
     * Deletes a todo label by its ID
     * @param id ID of the label to delete
     * @returns Promise resolving to the deleted TodoLabelEntity or null if not found
     */
    async deleteLabel(id: number): Promise<TodoLabelEntity | null> {
        return TodoLabelRepository.deleteLabel(id);
    }

    /**
     * Resolves an array of label names to their corresponding label entities
     * Creates labels that do not already exist
     * @param names Array of label names to resolve
     * @returns Promise resolving to an array of TodoLabelEntity objects
     */
    async resolveLabelsByNames(names: string[]): Promise<TodoLabelEntity[]> {
        const result: TodoLabelEntity[] = [];
        for (const nm of names) {
            const label = await TodoLabelRepository.findOrCreateByName(nm);
            result.push(label);
        }
        return result;
    }
}

export default new LabelService();
