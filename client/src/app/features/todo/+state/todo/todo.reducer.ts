import {createReducer, on} from '@ngrx/store';
import * as TodoActions from './todo.actions';
import {TodoModel} from '../../models/todo.model';

/**
 * NgRx reducer for todo state management.
 * Handles state changes based on dispatched actions.
 */


/**
 * Interface defining the shape of the todo state.
 */
export interface TodoState {
  /** Array of all todos */
  todos: TodoModel[];
  /** Currently selected todo for viewing or editing */
  selectedTodo: TodoModel | null;
  /** Flag indicating if a todo operation is in progress */
  loading: boolean;
  /** Error message from the most recent failed operation, or null if no error */
  error: string | null;
  /** Most recently generated description text */
  generatedDescription: string | null;
  /** Flag indicating if description generation is in progress */
  descriptionLoading: boolean;
}

/**
 * Initial state for todo feature.
 * Used as the starting point when the application loads.
 */
export const initialState: TodoState = {
  todos: [],
  selectedTodo: null,
  loading: false,
  error: null,
  generatedDescription: null,
  descriptionLoading: false
};

/**
 * Reducer function that handles state transitions for todo-related actions.
 * Each state change returns a new state object without mutating the original.
 */
export const todoReducer = createReducer(
  initialState,
  // Load Todos
  /**
   * Sets loading to true when todo loading begins.
   * Clears any previous errors.
   */
  on(TodoActions.loadTodos, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  /**
   * Updates state with loaded todos when loading succeeds.
   * Sets loading to false and clears errors.
   */
  on(TodoActions.loadTodosSuccess, (state, {todos}) => ({
    ...state,
    loading: false,
    todos,
    error: null
  })),
  /**
   * Sets error message when todo loading fails.
   * Sets loading to false.
   */
  on(TodoActions.loadTodosFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Todo By Id
  /**
   * Sets loading to true when loading a specific todo begins.
   * Clears any previous errors.
   */
  on(TodoActions.loadTodoById, state => ({
    ...state,
    loading: true,
    error: null
  })),
  /**
   * Updates selectedTodo when loading a specific todo succeeds.
   * Sets loading to false and clears errors.
   */
  on(TodoActions.loadTodoByIdSuccess, (state, {todo}) => ({
    ...state,
    selectedTodo: todo,
    loading: false,
    error: null
  })),
  /**
   * Sets error message when loading a specific todo fails.
   * Sets loading to false.
   */
  on(TodoActions.loadTodoByIdFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false
  })),

  // Create Todo
  /**
   * Sets loading to true when todo creation begins.
   * Clears any previous errors.
   */
  on(TodoActions.createTodo, state => ({
    ...state,
    loading: true,
    error: null
  })),
  /**
   * Adds the newly created todo to the todos array when creation succeeds.
   * Sets loading to false and clears errors.
   */
  on(TodoActions.createTodoSuccess, (state, {todo}) => ({
    ...state,
    todos: [...state.todos, todo],
    loading: false,
    error: null
  })),
  /**
   * Sets error message when todo creation fails.
   * Sets loading to false.
   */
  on(TodoActions.createTodoFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Todo
  /**
   * Sets loading to true when todo update begins.
   * Clears any previous errors.
   */
  on(TodoActions.updateTodo, state => ({
    ...state,
    loading: true,
    error: null
  })),
  /**
   * Updates the todo in the todos array when update succeeds.
   * Clears selectedTodo, sets loading to false, and clears errors.
   */
  on(TodoActions.updateTodoSuccess, (state, {todo}) => ({
    ...state,
    todos: state.todos.map(t => t.id === todo.id ? todo : t),
    selectedTodo: null,
    loading: false,
    error: null
  })),
  /**
   * Sets error message when todo update fails.
   * Sets loading to false.
   */
  on(TodoActions.updateTodoFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),

  // Toggle Todo
  /**
   * Sets loading to true when todo toggling begins.
   * Clears any previous errors.
   */
  on(TodoActions.toggleTodo, state => ({
    ...state,
    loading: true,
    error: null
  })),
  /**
   * Updates the todo in the todos array when toggling succeeds.
   * Sets loading to false and clears errors.
   */
  on(TodoActions.toggleTodoSuccess, (state, {todo}) => ({
    ...state,
    todos: state.todos.map(t => t.id === todo.id ? todo : t),
    loading: false,
    error: null
  })),
  /**
   * Sets error message when todo toggling fails.
   * Sets loading to false.
   */
  on(TodoActions.toggleTodoFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Todo Order
  /**
   * Sets loading to true when todo order update begins.
   * Clears any previous errors.
   */
  on(TodoActions.updateTodoOrder, state => ({
    ...state,
    loading: true,
    error: null
  })),
  /**
   * Updates the todo in the todos array when order update succeeds.
   * Sets loading to false and clears errors.
   */
  on(TodoActions.updateTodoOrderSuccess, (state, {todo}) => ({
    ...state,
    todos: state.todos.map(t => t.id === todo.id ? todo : t),
    loading: false,
    error: null
  })),
  /**
   * Sets error message when todo order update fails.
   * Sets loading to false.
   */
  on(TodoActions.updateTodoOrderFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Todo
  /**
   * Sets loading to true when todo deletion begins.
   * Clears any previous errors.
   */
  on(TodoActions.deleteTodo, state => ({
    ...state,
    loading: true,
    error: null
  })),
  /**
   * Removes the deleted todo from the todos array when deletion succeeds.
   * Clears selectedTodo if it was the deleted todo.
   * Sets loading to false and clears errors.
   */
  on(TodoActions.deleteTodoSuccess, (state, {id}) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id),
    selectedTodo: state.selectedTodo?.id === id ? null : state.selectedTodo,
    loading: false,
    error: null
  })),
  /**
   * Sets error message when todo deletion fails.
   * Sets loading to false.
   */
  on(TodoActions.deleteTodoFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),

  // Batch Update Orders
  /**
   * Sets loading to true when batch order update begins.
   * Clears any previous errors.
   */
  on(TodoActions.batchUpdateTodoOrders, state => ({
    ...state,
    loading: true,
    error: null
  })),
  /**
   * Sets loading to false and clears errors when batch update succeeds.
   * Actual todo list update happens with subsequent loadTodos action.
   */
  on(TodoActions.batchUpdateTodoOrdersSuccess, state => ({
    ...state,
    loading: false,
    error: null
  })),
  /**
   * Sets error message when batch order update fails.
   * Sets loading to false.
   */
  on(TodoActions.batchUpdateTodoOrdersFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),

  // Generate Description
  /**
   * Sets descriptionLoading to true when description generation begins.
   * Clears any previous errors.
   */
  on(TodoActions.generateDescription, state => ({
    ...state,
    descriptionLoading: true,
    error: null
  })),
  /**
   * Updates generatedDescription when generation succeeds.
   * Sets descriptionLoading to false and clears errors.
   */
  on(TodoActions.generateDescriptionSuccess, (state, {description}) => ({
    ...state,
    generatedDescription: description,
    descriptionLoading: false,
    error: null
  })),
  /**
   * Sets error message when description generation fails.
   * Sets descriptionLoading to false.
   */
  on(TodoActions.generateDescriptionFailure, (state, {error}) => ({
    ...state,
    descriptionLoading: false,
    error
  })),
);
