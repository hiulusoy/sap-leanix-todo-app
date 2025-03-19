import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as TodoActions from './todo.actions';

import {catchError, concatMap, map, mergeMap, of, tap} from 'rxjs';

import {Router} from '@angular/router';
import {TodoService} from '../../services/todo.service';
import {TodoModel} from '../../models/todo.model';


/**
 * NgRx effects for todo state management.
 * Coordinates side effects like API calls for todo-related operations.
 */
@Injectable()
export class TodoEffects {
  /**
   * Creates an instance of TodoEffects.
   *
   * @param actions$ - Observable of all dispatched actions
   * @param todoService - Service for making todo-related API calls
   * @param router - Angular router for navigation after operations
   */
  constructor(
    private actions$: Actions,
    private todoService: TodoService,
    private router: Router
  ) {
    console.log('Actions$', this.actions$);
    console.log('TodoService', this.todoService);
  }

  /**
   * Effect that handles loading all todos from the backend.
   * Listens for loadTodos action and makes an API call to fetch todos.
   * Dispatches success action with loaded todos or failure action with error.
   */
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      mergeMap(() =>
        this.todoService.getAll().pipe(
          map((todos) => TodoActions.loadTodosSuccess({todos})),
          catchError((error) =>
            of(TodoActions.loadTodosFailure({error: error.message}))
          )
        )
      )
    )
  );

  /**
   * Effect that handles loading a specific todo by ID.
   * Listens for loadTodoById action and makes an API call to fetch the todo.
   * Dispatches success action with loaded todo or failure action with error.
   */
  loadTodoById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodoById),
      mergeMap(({id}) =>
        this.todoService.getById(id).pipe(
          map(todo => {
            if (!todo) {
              throw new Error(`Todo with id ${id} not found`);
            }
            return TodoActions.loadTodoByIdSuccess({todo});
          }),
          catchError(error => of(TodoActions.loadTodoByIdFailure({error: error.toString()})))
        )
      )
    )
  );

  /**
   * Effect that handles creating a new todo.
   * Listens for createTodo action and makes an API call to create the todo.
   * Dispatches success action with created todo or failure action with error.
   */
  createTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.createTodo),
      mergeMap(({todo}) =>
        this.todoService.create(todo).pipe(
          map((createdTodo) => TodoActions.createTodoSuccess({todo: createdTodo})),
          catchError((error) =>
            of(TodoActions.createTodoFailure({error: error.message}))
          )
        )
      )
    )
  );

  /**
   * Effect that handles toggling a todo's completion status.
   * Listens for toggleTodo action and makes an API call to toggle the todo.
   * Dispatches success action with updated todo or failure action with error.
   */
  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      mergeMap(({id}) =>
        this.todoService.toggle(id).pipe(
          map((updatedTodo: TodoModel) =>
            TodoActions.toggleTodoSuccess({todo: updatedTodo})
          ),
          catchError((error) =>
            of(TodoActions.toggleTodoFailure({error: error.message}))
          )
        )
      )
    )
  );

  /**
   * Effect that navigates to the todo list page after successfully creating a todo.
   * Non-dispatching effect (does not dispatch a new action).
   */
  createTodoSuccessNavigate$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TodoActions.createTodoSuccess),
        tap(() => this.router.navigate(['app/todo/list']))
      ),
    {dispatch: false}
  );

  /**
   * Effect that handles updating a single todo's order.
   * Listens for updateTodoOrder action and makes an API call to update the order.
   * Dispatches success action with updated todo or failure action with error.
   */
  updateTodoOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodoOrder),
      mergeMap(({id, order}) =>
        this.todoService.updateTodoOrder(id, order).pipe(
          map((updatedTodo: TodoModel) =>
            TodoActions.updateTodoOrderSuccess({todo: updatedTodo})
          ),
          catchError((error) =>
            of(TodoActions.updateTodoOrderFailure({error: error.message}))
          )
        )
      )
    )
  );

  /**
   * Effect that handles updating a todo's properties.
   * Listens for updateTodo action and makes an API call to update the todo.
   * Includes debug logging to track the update process.
   * Dispatches success action with updated todo or failure action with error.
   */
  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      tap(action => console.log('Update Todo action dispatched:', action)),
      mergeMap(({id, todo}) =>
        this.todoService.update(id, todo).pipe(
          tap(response => console.log('Update Todo API response:', response)),
          map(updatedTodo => TodoActions.updateTodoSuccess({todo: updatedTodo})),
          catchError(error => {
            console.error('Update Todo API error:', error);
            return of(TodoActions.updateTodoFailure({error: error.toString()}));
          })
        )
      )
    )
  );

  /**
   * Effect that handles updating multiple todos' orders in a single operation.
   * Listens for batchUpdateTodoOrders action and makes an API call to update orders.
   * Dispatches success action or failure action with error.
   */
  batchUpdateTodoOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.batchUpdateTodoOrders),
      mergeMap(({updates}) =>
        this.todoService.batchUpdateTodoOrders(updates).pipe(
          map(() => TodoActions.batchUpdateTodoOrdersSuccess()),
          catchError((error) =>
            of(TodoActions.batchUpdateTodoOrdersFailure({error: error.message}))
          )
        )
      )
    )
  );

  /**
   * Effect that reloads todos after a successful batch update of orders.
   * Ensures the UI displays the latest order information from the backend.
   */
  reloadAfterBatchUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.batchUpdateTodoOrdersSuccess),
      map(() => TodoActions.loadTodos())
    )
  );

  /**
   * Effect that handles deleting a todo.
   * Listens for deleteTodo action and makes an API call to delete the todo.
   * Uses concatMap to ensure deletes are processed in sequence.
   * Dispatches success action with todo ID or failure action with error.
   */
  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      concatMap(({id}) =>
        this.todoService.deleteTodo(id).pipe(
          map(() => TodoActions.deleteTodoSuccess({id})),
          catchError((error) =>
            of(TodoActions.deleteTodoFailure({error: error.message}))
          )
        )
      )
    )
  );

  /**
   * Effect that handles generating a description for a todo using AI.
   * Listens for generateDescription action and makes an API call to generate description.
   * Processes the response to extract and clean up the generated description.
   * Dispatches success action with description or failure action with error.
   */
  generateDescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.generateDescription),
      mergeMap(({input}) =>
        this.todoService.generateDescription(input).pipe(
          map(response => {
            // Extract the description from the response
            let description = typeof response === 'object' && response.description
              ? response.description
              : (typeof response === 'string' ? response : '');

            // Clean up the description by removing any "Task Description:" prefix
            description = description.replace(/^(Task Description:)/i, '').trim();

            return TodoActions.generateDescriptionSuccess({description});
          }),
          catchError(error => {
            console.error('Description generation error:', error);
            return of(TodoActions.generateDescriptionFailure({error: error.toString()}));
          })
        )
      )
    )
  );
}
