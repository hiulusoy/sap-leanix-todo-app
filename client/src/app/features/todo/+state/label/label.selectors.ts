import {createFeatureSelector, createSelector} from '@ngrx/store';
import {LabelState} from './label.reducer';

/**
 * NgRx selectors for accessing label state.
 * Selectors are pure functions that extract specific pieces of state.
 */

/**
 * Base selector that gets the entire label feature state.
 * This is the foundation for more specific selectors.
 */
export const selectLabelState = createFeatureSelector<LabelState>('labels');

/**
 * Selector for accessing the complete array of labels.
 * Used to display label lists in the UI.
 *
 * @returns An array of LabelModel objects
 */
export const selectAllLabels = createSelector(
  selectLabelState,
  (state) => state.labels
);

/**
 * Selector for determining if label operations are in progress.
 * Used to show loading indicators in the UI.
 *
 * @returns Boolean indicating loading status
 */
export const selectLabelLoading = createSelector(
  selectLabelState,
  (state) => state.loading
);

/**
 * Selector for accessing any error message related to label operations.
 * Used to display error notifications in the UI.
 *
 * @returns Error message string or null if no error
 */
export const selectLabelError = createSelector(
  selectLabelState,
  (state) => state.error
);
