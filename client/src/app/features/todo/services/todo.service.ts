import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseService} from '../../../core/services/base.service';
import {TodoModel} from '../models/todo.model';
import {DescriptionInputModel} from '../models/description.model';


/**
 * Service for handling todo-related operations.
 * Extends the BaseService to utilize common HTTP methods.
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Retrieves a list of todos.
   */
  getAll(): Observable<TodoModel[]> {
    return this.get<TodoModel[]>('/todos');
  }

  /**
   * Retrieves a single todo by its ID.
   * @param id The ID of the todo.
   */
  getById(id: number): Observable<TodoModel> {
    return this.get<TodoModel>(`/todos/${id}`);
  }

  /**
   * Creates a new todo.
   * @param todo A partial TodoModel object containing the data for the new todo.
   */
  create(todo: Partial<TodoModel>): Observable<TodoModel> {
    return this.post<TodoModel, Partial<TodoModel>>('/todos', todo);
  }

  /**
   * Updates an existing todo.
   * @param id The ID of the todo to update.
   * @param todo A partial TodoModel object with updated data.
   */
  update(id: number, todo: Partial<TodoModel>): Observable<TodoModel> {
    return this.put<TodoModel, Partial<TodoModel>>(`/todos/${id}`, todo);
  }

  /**
   * Toggles the completion status of a todo.
   * @param id The ID of the todo to toggle.
   */
  toggle(id: number): Observable<TodoModel> {
    return this.patch<TodoModel, null>(`/todos/${id}/toggle`, null);
  }

  /**
   * Deletes a todo (soft delete).
   * @param id The ID of the todo to delete.
   */
  deleteTodo(id: number): Observable<any> {
    return this.delete(`/todos/${id}`);
  }

  /**
   * Updates the order of a single todo.
   * @param id The ID of the todo to update.
   * @param order The new order value.
   */
  updateTodoOrder(id: number, order: number): Observable<TodoModel> {
    return this.patch<TodoModel, { order: number }>(`/todos/${id}/order`, {order});
  }

  /**
   * Updates the orders of multiple todos in a single request.
   * @param updates An array of objects containing todo IDs and their new order values.
   */
  batchUpdateTodoOrders(updates: { id: number, order: number }[]): Observable<any> {
    return this.post<any, { updates: { id: number, order: number }[] }>('/todos/batch-update-orders', {updates});
  }

  /**
   * Generates a description for a todo using OpenAI
   * @param input Object containing the title and optional context information
   * @returns An observable with the generated description
   */
  generateDescription(input: DescriptionInputModel): Observable<{ description: string }> {
    return this.post<{ description: string }, DescriptionInputModel>('/todos/generate-description', input);
  }
}
