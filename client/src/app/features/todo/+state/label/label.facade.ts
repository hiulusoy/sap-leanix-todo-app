import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {LabelModel} from '../../models/label.model';
import * as LabelActions from './label.actions';
import * as LabelSelectors from './label.selectors';

/**
 * Facade service for interacting with the label state.
 * Provides a simplified API for components to interact with the NgRx store.
 * Abstracts away the complexity of state management from components.
 */
@Injectable({
  providedIn: 'root',
})
export class LabelFacade {
  /**
   * Observable of all available labels in the store.
   * Components can subscribe to this to display labels.
   */
  labels$: Observable<LabelModel[]> = this.store.select(LabelSelectors.selectAllLabels);

  /**
   * Observable indicating whether labels are currently being loaded.
   * Can be used to show loading indicators in the UI.
   */
  loading$: Observable<boolean> = this.store.select(LabelSelectors.selectLabelLoading);

  /**
   * Observable of any error message related to label operations.
   * Useful for displaying error notifications to users.
   */
  error$: Observable<string | null> = this.store.select(LabelSelectors.selectLabelError);

  /**
   * Creates an instance of LabelFacade.
   * @param store - NgRx store for state management
   */
  constructor(private store: Store) {
  }

  /**
   * Dispatches an action to load all labels from the backend.
   * Components can call this method to trigger label fetching.
   */
  loadLabels(): void {
    this.store.dispatch(LabelActions.loadLabels());
  }

  /**
   * Dispatches an action to create a new label with the given name.
   *
   * @param name - Name of the label to create
   */
  createLabel(name: string): void {
    this.store.dispatch(LabelActions.createLabel({name}));
  }
}
