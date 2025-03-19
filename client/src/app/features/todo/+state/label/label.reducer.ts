import {createReducer, on} from '@ngrx/store';
import * as LabelActions from './label.actions';
import {LabelModel} from '../../models/label.model';

/**
 * NgRx reducer for label state management.
 * Handles state changes based on dispatched actions.
 */

/**
 * Interface defining the shape of the label state.
 */
export interface LabelState {
  /** Array of all labels */
  labels: LabelModel[];
  /** Flag indicating if a label operation is in progress */
  loading: boolean;
  /** Error message from the most recent failed operation, or null if no error */
  error: string | null;
}

/**
 * Initial state for label feature.
 * Used as the starting point when the application loads.
 */
export const initialLabelState: LabelState = {
  labels: [],
  loading: false,
  error: null
};

/**
 * Reducer function that handles state transitions for label-related actions.
 * Each state change returns a new state object without mutating the original.
 */
export const labelReducer = createReducer(
  initialLabelState,

  // Load Labels Actions
  /**
   * Sets loading to true when label loading begins.
   * Clears any previous errors.
   */
  on(LabelActions.loadLabels, (state) => ({
    ...state, loading: true, error: null
  })),

  /**
   * Updates state with loaded labels when loading succeeds.
   * Sets loading to false.
   */
  on(LabelActions.loadLabelsSuccess, (state, {labels}) => ({
    ...state, loading: false, labels
  })),

  /**
   * Sets error message when label loading fails.
   * Sets loading to false.
   */
  on(LabelActions.loadLabelsFailure, (state, {error}) => ({
    ...state, loading: false, error
  })),

  // Create Label Actions
  /**
   * Sets loading to true when label creation begins.
   * Clears any previous errors.
   */
  on(LabelActions.createLabel, (state) => ({
    ...state, loading: true, error: null
  })),

  /**
   * Adds the newly created label to the labels array when creation succeeds.
   * Sets loading to false.
   */
  on(LabelActions.createLabelSuccess, (state, {label}) => ({
    ...state,
    loading: false,
    labels: [...state.labels, label]
  })),

  /**
   * Sets error message when label creation fails.
   * Sets loading to false.
   */
  on(LabelActions.createLabelFailure, (state, {error}) => ({
    ...state, loading: false, error
  }))
);
