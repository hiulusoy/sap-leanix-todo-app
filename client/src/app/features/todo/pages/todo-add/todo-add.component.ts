import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoFacade} from '../../+state/todo/todo.facade';
import {ActivatedRoute, Router} from '@angular/router';
import {TodoModel} from '../../models/todo.model';
import {Subject} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-todo-add',
  standalone: false,
  templateUrl: './todo-add.component.html',
  styleUrl: './todo-add.component.scss'
})
export class TodoAddComponent implements OnInit, OnDestroy {
  /** Flag indicating whether the component is in edit mode */
  isEditMode = false;

  /** ID of the to-do being edited (null in create mode) */
  todoId: number | null = null;

  /** Current to-do data loaded for editing (null in create mode) */
  currentTodo: TodoModel | null = null;

  /** Subject for managing subscription cleanup */
  private destroy$ = new Subject<void>();

  /**
   * Creates an instance of TodoAddComponent.
   * @param todoFacade - Service for interacting with to-do state
   * @param route - Current activated route for reading parameters
   * @param router - Angular router for navigation
   */
  constructor(
    private todoFacade: TodoFacade,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  /**
   * Lifecycle hook that initializes component.
   * Determines whether the component is in create or edit mode based on route parameters.
   * If in edit mode, loads the to-do data for editing.
   */
  ngOnInit(): void {
    // Check if we're in edit mode by looking for an ID parameter
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.todoId = +params['id']; // Convert to number
        this.loadTodoData(this.todoId);
      }
    });
  }

  /**
   * Lifecycle hook that cleans up subscriptions when component is destroyed.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads to-do data for editing based on the specified ID.
   * Subscribes to the selected to-do from the store and updates the component state.
   *
   * @param id - ID of the to-do item to load
   */
  loadTodoData(id: number): void {
    // Load the specific todo by ID
    this.todoFacade.loadTodoById(id);

    // Subscribe to get the todo data
    this.todoFacade.selectedTodo$
      .pipe(
        takeUntil(this.destroy$),
        filter(todo => !!todo), // Only proceed when we have a todo
        tap(todo => {
          console.log('Loaded todo for editing:', todo);

          // Check if labels exist and log them
          if (todo?.labels) {
            console.log('Todo labels:', todo.labels);
          } else {
            console.warn('No labels found in todo data');
          }
        })
      )
      .subscribe(todo => {
        // Ensure labels are initialized even if they're missing from the API response
        this.currentTodo = {
          ...todo as TodoModel,
          labels: todo?.labels || []
        };
      });
  }

  /**
   * Handles form submission for both create and edit modes.
   * Dispatches appropriate actions to create or update a to-do item and
   * navigates back to the to-do list after successful submission.
   *
   * @param todoData - Form data submitted by the user
   */
  onFormSubmitted(todoData: Partial<TodoModel>): void {
    console.log('Form submitted with data:', todoData);

    if (this.isEditMode && this.todoId) {
      // Update existing todo
      console.log('Updating todo with ID:', this.todoId);
      this.todoFacade.updateTodo(this.todoId, todoData);
    } else {
      // Create new todo
      console.log('Creating new todo');
      this.todoFacade.createTodo(todoData);
    }

    // Navigate back to the todo list after submission
    this.router.navigate(['/app/todo/list']);
  }
}
