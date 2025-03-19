import {createFeatureSelector, createSelector} from '@ngrx/store';
import {TodoState} from './todo.reducer';


/**
 * NgRx selectors for accessing todo state.
 * Selectors are pure functions that extract specific pieces of state.
 */

/**
 * Base selector that gets the entire todo feature state.
 * This is the foundation for more specific selectors.
 * Note: The feature key ('todos') must match the key used in StoreModule.forFeature().
 */
export const selectTodoState = createFeatureSelector<TodoState>('todos');

/**
 * Selector for accessing the complete array of todos.
 * Used to display todo lists in the UI.
 *
 * @returns An array of TodoModel objects
 */
export const selectAllTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

/**
 * Selector for accessing the currently selected todo.
 * Used when viewing or editing a specific todo.
 *
 * @returns The selected TodoModel or null if none is selected
 */
export const selectSelectedTodo = createSelector(
  selectTodoState,
  state => state.selectedTodo
);

/**
 * Selector for determining if todo operations are in progress.
 * Used to show loading indicators in the UI.
 *
 * @returns Boolean indicating loading status
 */
export const selectLoading = createSelector(
  selectTodoState,
  (state: TodoState) => state.loading
);

/**
 * Selector for accessing any error message related to todo operations.
 * Used to display error notifications in the UI.
 *
 * @returns Error message string or null if no error
 */
export const selectError = createSelector(
  selectTodoState,
  (state: TodoState) => state.error
);

/**
 * Selector for accessing the most recently generated description.
 * Used by the description component to display AI-generated content.
 *
 * @returns The generated description string or null if none exists
 */
export const selectGeneratedDescription = createSelector(
  selectTodoState,
  (state: TodoState) => state.generatedDescription
);

/**
 * Selector for determining if description generation is in progress.
 * Used to show loading indicators during AI description generation.
 *
 * @returns Boolean indicating description loading status
 */
export const selectDescriptionLoading = createSelector(
  selectTodoState,
  (state: TodoState) => state.descriptionLoading
);
