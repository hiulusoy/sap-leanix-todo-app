/**
 * NgRx actions for label state management.
 * These actions handle loading labels, creating new labels, and tracking success/failure states.
 */

import {createAction, props} from '@ngrx/store';
import {LabelModel} from '../../models/label.model';

/**
 * Action to initiate loading all labels.
 * Triggered when the application needs to fetch labels from the backend.
 */
export const loadLabels = createAction('[Label] Load Labels');

/**
 * Action dispatched when labels are successfully loaded.
 * Contains the array of retrieved label objects.
 *
 * @param labels - Array of label models fetched from the backend
 */
export const loadLabelsSuccess = createAction(
  '[Label] Load Labels Success',
  props<{ labels: LabelModel[] }>()
);

/**
 * Action dispatched when loading labels fails.
 * Contains the error message from the failed request.
 *
 * @param error - Error message describing why label loading failed
 */
export const loadLabelsFailure = createAction(
  '[Label] Load Labels Failure',
  props<{ error: string }>()
);

/**
 * Action to initiate label creation.
 * Triggered when a user requests to create a new label.
 *
 * @param name - Name of the label to create
 */
export const createLabel = createAction(
  '[Label] Create Label',
  props<{ name: string }>()
);

/**
 * Action dispatched when a label is successfully created.
 * Contains the newly created label object.
 *
 * @param label - The newly created label model returned from the backend
 */
export const createLabelSuccess = createAction(
  '[Label] Create Label Success',
  props<{ label: LabelModel }>()
);

/**
 * Action dispatched when label creation fails.
 * Contains the error message from the failed request.
 *
 * @param error - Error message describing why label creation failed
 */
export const createLabelFailure = createAction(
  '[Label] Create Label Failure',
  props<{ error: string }>()
);
