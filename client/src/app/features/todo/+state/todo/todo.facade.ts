import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {TodoModel} from '../../models/todo.model';
import * as TodoActions from './todo.actions';
import * as TodoSelectors from './todo.selectors';
import {DescriptionInputModel} from '../../models/description.model';


/**
 * Facade service for interacting with the todo state.
 * Provides a simplified API for components to interact with the NgRx store.
 * Abstracts away the complexity of state management from components.
 */
@Injectable({
  providedIn: 'root'
})
export class TodoFacade {
  /**
   * Observable of all todos in the store.
   * Components can subscribe to this to display todo lists.
   */
  todos$: Observable<TodoModel[]> = this.store.select(TodoSelectors.selectAllTodos);

  /**
   * Observable of the currently selected todo.
   * Used for viewing or editing a single todo.
   */
  selectedTodo$: Observable<TodoModel | null> = this.store.select(TodoSelectors.selectSelectedTodo);

  /**
   * Observable indicating whether todo operations are in progress.
   * Can be used to show loading indicators in the UI.
   */
  loading$: Observable<boolean> = this.store.select(TodoSelectors.selectLoading);

  /**
   * Observable of any error message related to todo operations.
   * Useful for displaying error notifications to users.
   */
  error$: Observable<string | null> = this.store.select(TodoSelectors.selectError);

  /**
   * Observable of the most recently generated description.
   * Used by the description component to show AI-generated content.
   */
  generatedDescription$: Observable<string | null> = this.store.select(TodoSelectors.selectGeneratedDescription);

  /**
   * Observable indicating whether description generation is in progress.
   * Used to show loading indicators during AI description generation.
   */
  descriptionLoading$: Observable<boolean> = this.store.select(TodoSelectors.selectDescriptionLoading);

  /**
   * Creates an instance of TodoFacade.
   * @param store - NgRx store for state management
   */
  constructor(private store: Store) {
  }

  /**
   * Dispatches an action to load all todos from the backend.
   * Components can call this method to trigger todo fetching.
   */
  loadTodos(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  /**
   * Dispatches an action to load a specific todo by ID.
   * Used when viewing or editing a single todo.
   *
   * @param id - ID of the todo to load
   */
  loadTodoById(id: number): void {
    this.store.dispatch(TodoActions.loadTodoById({id}));
  }

  /**
   * Dispatches an action to create a new todo.
   *
   * @param todo - Partial todo data for creating a new todo
   */
  createTodo(todo: Partial<TodoModel>): void {
    this.store.dispatch(TodoActions.createTodo({todo}));
  }

  /**
   * Dispatches an action to update an existing todo.
   *
   * @param id - ID of the todo to update
   * @param todo - Partial todo data containing fields to update
   */
  updateTodo(id: number, todo: Partial<TodoModel>): void {
    this.store.dispatch(TodoActions.updateTodo({id, todo}));
  }

  /**
   * Dispatches an action to toggle a todo's completion status.
   *
   * @param id - ID of the todo to toggle
   */
  toggleTodo(id: number): void {
    this.store.dispatch(TodoActions.toggleTodo({id}));
  }

  /**
   * Dispatches an action to update a todo's display order.
   *
   * @param id - ID of the todo to reorder
   * @param order - New order value for the todo
   */
  updateTodoOrder(id: number, order: number): void {
    this.store.dispatch(TodoActions.updateTodoOrder({id, order}));
  }

  /**
   * Dispatches an action to update multiple todos' orders in a single operation.
   * Used after drag-and-drop reordering of multiple todos.
   *
   * @param updates - Array of objects with todo IDs and their new order values
   */
  batchUpdateTodoOrders(updates: { id: number, order: number }[]): void {
    this.store.dispatch(TodoActions.batchUpdateTodoOrders({updates}));
  }

  /**
   * Dispatches an action to delete a todo.
   *
   * @param id - ID of the todo to delete
   */
  deleteTodo(id: number): void {
    this.store.dispatch(TodoActions.deleteTodo({id}));
  }

  /**
   * Dispatches an action to generate a description for a todo using AI.
   *
   * @param input - Input data used for generating the description
   */
  generateDescription(input: DescriptionInputModel): void {
    this.store.dispatch(TodoActions.generateDescription({input}));
  }
}
