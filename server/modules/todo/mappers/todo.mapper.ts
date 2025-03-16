import {TodoDto} from "../dto/todo.dto";
import {TodoEntity} from "../entity/todo.entity";

export const mapTodoToDTO = (todo: TodoEntity): TodoDto => ({
    id: todo.id,
    title: todo.title,
    state: todo.state,
    active: todo.active,
    description: todo.description,
    labels: todo.labels?.map(label => label.name),
    startDate: todo.startDate,
    dueDate: todo.dueDate,
    hasDueDate: todo.hasDueDate,
    createdBy: todo.createdBy,
    updatedBy: todo.updatedBy,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
});
