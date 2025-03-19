import {createAction, props} from '@ngrx/store';
import {TodoModel} from '../../models/todo.model';
import {DescriptionInputModel} from '../../models/description.model';


/**
 * NgRx actions for todo state management.
 * These actions handle various todo operations including loading, creating, updating, and deleting todos.
 */

/**
 * Action to initiate loading all todos.
 * Triggered when the application needs to fetch todos from the backend.
 */
export const loadTodos = createAction('[Todo] Load Todos');

/**
 * Action dispatched when todos are successfully loaded.
 * Contains the array of retrieved todo objects.
 *
 * @param todos - Array of todo models fetched from the backend
 */
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: TodoModel[] }>()
);

/**
 * Action dispatched when loading todos fails.
 * Contains the error from the failed request.
 *
 * @param error - Error describing why todo loading failed
 */
export const loadTodosFailure = createAction(
  '[Todo] Load Todos Failure',
  props<{ error: any }>()
);

/**
 * Action to load a specific todo by its ID.
 * Used when viewing or editing a single todo.
 *
 * @param id - ID of the todo to load
 */
export const loadTodoById = createAction(
  '[Todo] Load Todo By Id',
  props<{ id: number }>()
);

/**
 * Action dispatched when a todo is successfully loaded by ID.
 * Contains the loaded todo object.
 *
 * @param todo - The todo model loaded from the backend
 */
export const loadTodoByIdSuccess = createAction(
  '[Todo] Load Todo By Id Success',
  props<{ todo: TodoModel }>()
);

/**
 * Action dispatched when loading a todo by ID fails.
 * Contains the error message from the failed request.
 *
 * @param error - Error message describing why todo loading failed
 */
export const loadTodoByIdFailure = createAction(
  '[Todo] Load Todo By Id Failure',
  props<{ error: string }>()
);

/**
 * Action to create a new todo.
 * Triggered when a user submits the create todo form.
 *
 * @param todo - Partial todo data for creating a new todo
 */
export const createTodo = createAction(
  '[Todo] Create Todo',
  props<{ todo: Partial<TodoModel> }>()
);

/**
 * Action dispatched when a todo is successfully created.
 * Contains the newly created todo object returned from the backend.
 *
 * @param todo - The newly created todo model
 */
export const createTodoSuccess = createAction(
  '[Todo] Create Todo Success',
  props<{ todo: TodoModel }>()
);

/**
 * Action dispatched when todo creation fails.
 * Contains the error from the failed request.
 *
 * @param error - Error describing why todo creation failed
 */
export const createTodoFailure = createAction(
  '[Todo] Create Todo Failure',
  props<{ error: any }>()
);

/**
 * Action to toggle a todo's completion status.
 * Used when a user marks a todo as complete or incomplete.
 *
 * @param id - ID of the todo to toggle
 */
export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: number }>()
);

/**
 * Action dispatched when a todo's status is successfully toggled.
 * Contains the updated todo object.
 *
 * @param todo - The updated todo model with toggled status
 */
export const toggleTodoSuccess = createAction(
  '[Todo] Toggle Todo Success',
  props<{ todo: TodoModel }>()
);

/**
 * Action dispatched when toggling a todo fails.
 * Contains the error from the failed request.
 *
 * @param error - Error describing why todo toggling failed
 */
export const toggleTodoFailure = createAction(
  '[Todo] Toggle Todo Failure',
  props<{ error: any }>()
);

/**
 * Action to update a todo's properties.
 * Triggered when a user submits the edit todo form.
 *
 * @param id - ID of the todo to update
 * @param todo - Partial todo data containing the fields to update
 */
export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ id: number, todo: Partial<TodoModel> }>()
);

/**
 * Action dispatched when a todo is successfully updated.
 * Contains the updated todo object.
 *
 * @param todo - The updated todo model returned from the backend
 */
export const updateTodoSuccess = createAction(
  '[Todo] Update Todo Success',
  props<{ todo: TodoModel }>()
);

/**
 * Action dispatched when updating a todo fails.
 * Contains the error message from the failed request.
 *
 * @param error - Error message describing why todo updating failed
 */
export const updateTodoFailure = createAction(
  '[Todo] Update Todo Failure',
  props<{ error: string }>()
);

/**
 * Action to update a todo's display order.
 * Used for reordering todos in the UI.
 *
 * @param id - ID of the todo to reorder
 * @param order - New order value for the todo
 */
export const updateTodoOrder = createAction(
  '[Todo] Update Todo Order',
  props<{ id: number, order: number }>()
);

/**
 * Action dispatched when a todo's order is successfully updated.
 * Contains the updated todo object.
 *
 * @param todo - The updated todo model with new order
 */
export const updateTodoOrderSuccess = createAction(
  '[Todo] Update Todo Order Success',
  props<{ todo: TodoModel }>()
);

/**
 * Action dispatched when updating a todo's order fails.
 * Contains the error from the failed request.
 *
 * @param error - Error describing why order updating failed
 */
export const updateTodoOrderFailure = createAction(
  '[Todo] Update Todo Order Failure',
  props<{ error: any }>()
);

/**
 * Action to generate a description for a todo using AI.
 * Triggered when a user requests an auto-generated description.
 *
 * @param input - Data used to generate the description
 */
export const generateDescription = createAction(
  '[Todo] Generate Description',
  props<{ input: DescriptionInputModel }>()
);

/**
 * Action dispatched when a description is successfully generated.
 * Contains the generated description text.
 *
 * @param description - The AI-generated description text
 */
export const generateDescriptionSuccess = createAction(
  '[Todo] Generate Description Success',
  props<{ description: string }>()
);

/**
 * Action dispatched when description generation fails.
 * Contains the error from the failed request.
 *
 * @param error - Error describing why description generation failed
 */
export const generateDescriptionFailure = createAction(
  '[Todo] Generate Description Failure',
  props<{ error: any }>()
);

/**
 * Action to delete a todo.
 * Triggered when a user confirms deletion of a todo.
 *
 * @param id - ID of the todo to delete
 */
export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: number }>()
);

/**
 * Action dispatched when a todo is successfully deleted.
 * Contains the ID of the deleted todo.
 *
 * @param id - ID of the successfully deleted todo
 */
export const deleteTodoSuccess = createAction(
  '[Todo] Delete Todo Success',
  props<{ id: number }>()
);

/**
 * Action dispatched when deleting a todo fails.
 * Contains the error from the failed request.
 *
 * @param error - Error describing why todo deletion failed
 */
export const deleteTodoFailure = createAction(
  '[Todo] Delete Todo Failure',
  props<{ error: any }>()
);

/**
 * Action to update the order of multiple todos in a single operation.
 * Used when reordering multiple todos at once, such as after drag-and-drop.
 *
 * @param updates - Array of objects containing todo IDs and their new order values
 */
export const batchUpdateTodoOrders = createAction(
  '[Todo] Batch Update Todo Orders',
  props<{ updates: { id: number, order: number }[] }>()
);

/**
 * Action dispatched when batch update of todo orders succeeds.
 * No payload is needed as the success is for the entire batch operation.
 */
export const batchUpdateTodoOrdersSuccess = createAction(
  '[Todo] Batch Update Todo Orders Success'
);

/**
 * Action dispatched when batch updating todo orders fails.
 * Contains the error from the failed request.
 *
 * @param error - Error describing why batch update failed
 */
export const batchUpdateTodoOrdersFailure = createAction(
  '[Todo] Batch Update Todo Orders Failure',
  props<{ error: any }>()
);
