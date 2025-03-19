import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as LabelActions from './label.actions';
import {catchError, map, mergeMap, of} from 'rxjs';
import {LabelService} from '../../services/label.service';


@Injectable()
export class LabelEffects {
  /**
   * Creates an instance of LabelEffects.
   *
   * @param actions$ - Observable of all dispatched actions
   * @param labelService - Service for making label-related API calls
   */
  constructor(
    private actions$: Actions,
    private labelService: LabelService
  ) {
  }

  /**
   * Effect that handles loading labels from the backend.
   * Listens for the loadLabels action and makes an API call to fetch labels.
   * Dispatches success action with loaded labels or failure action with error.
   */
  loadLabels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabelActions.loadLabels),
      mergeMap(() =>
        this.labelService.getLabels().pipe(
          map(labels => LabelActions.loadLabelsSuccess({labels})),
          catchError(error =>
            of(LabelActions.loadLabelsFailure({error: error.message}))
          )
        )
      )
    )
  );

  /**
   * Effect that handles creating a new label.
   * Listens for the createLabel action and makes an API call to create the label.
   * Dispatches success action with the created label or failure action with error.
   */
  createLabel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LabelActions.createLabel),
      mergeMap(({name}) =>
        this.labelService.createLabel(name).pipe(
          map(label => LabelActions.createLabelSuccess({label})),
          catchError(error =>
            of(LabelActions.createLabelFailure({error: error.message}))
          )
        )
      )
    )
  );
}
