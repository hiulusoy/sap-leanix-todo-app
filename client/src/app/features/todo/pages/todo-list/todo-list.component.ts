import {Component, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {TodoModel} from '../../models/todo.model';
import {Router} from '@angular/router';
import {TodoFacade} from '../../+state/todo/todo.facade';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

interface DisplayTodoModel extends TodoModel {
  displayState?: string;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: false
})
export class TodoListComponent implements OnInit, OnDestroy {
  /** Array of pending to-do items */
  todo: DisplayTodoModel[] = [];

  /** Array of completed to-do items */
  done: DisplayTodoModel[] = [];

  /** Subject for managing subscription cleanup */
  private destroy$ = new Subject<void>();

  /** Map to track temporary UI state changes before backend update */
  private visualStateMap = new Map<number, string>();

  /** Flag to prevent redundant updates during drag operations */
  private isDragging = false;

  /**
   * Lifecycle hook that initializes component.
   * Loads to-do items from the backend.
   */
  private deletedIds = new Set<number>();

  constructor(private todoFacade: TodoFacade, private router: Router) {
  }

  /**
   * Lifecycle hook that initializes component.
   * Loads to-do items from the backend.
   */
  ngOnInit(): void {
    this.loadTodos();
  }

  /**
   * Lifecycle hook that cleans up subscriptions when component is destroyed.
   */
  ngOnDestroy(): void {
    // Cleanup
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads to-do items from the backend and subscribes to state updates.
   * Filters, sorts, and updates the local lists of to-do items.
   */
  loadTodos(): void {
    this.todoFacade.loadTodos();
    this.todoFacade.todos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((todos: TodoModel[]) => {
        console.log('Received todos from state:', todos.length);

        // Skip state update if dragging
        if (this.isDragging) {
          console.log('Dragging in progress, skipping state update');
          this.isDragging = false;
          return;
        }

        // Filter out any todos that we know were deleted locally
        const filteredTodos = todos.filter(todo => !this.deletedIds.has(todo.id));
        console.log('Todos after filtering deleted IDs:', filteredTodos.length);

        // Display todos with displayState
        const displayTodos = filteredTodos.map(item => ({
          ...item,
          displayState: this.visualStateMap.get(item.id) || item.state
        }));

        // Sort by order from backend
        this.todo = displayTodos
          .filter(item => item.state === 'pending')
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        this.done = displayTodos
          .filter(item => item.state === 'completed')
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        // Clear visual state map once UI and backend state match
        this.clearVisualStateMap();
      });
  }

  /**
   * Clears the visual state map once UI and backend states are synchronized.
   * @private
   */
  private clearVisualStateMap(): void {
    this.visualStateMap.clear();
  }

  /**
   * Handles drop events from the drag and drop interface.
   * Updates item order and status based on drop location.
   * Sends updates to the backend.
   *
   * @param event - Drag and drop event containing source and target information
   */
  drop(event: CdkDragDrop<DisplayTodoModel[]>): void {
    // Mark dragging operation started
    this.isDragging = true;

    // Array for updating orders
    const updates: { id: number, order: number }[] = [];

    if (event.previousContainer === event.container) {
      // Reordering within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      // Calculate new order values for each item
      event.container.data.forEach((item, index) => {
        updates.push({id: item.id, order: index});
      });

      // Send batch order update to backend
      this.todoFacade.batchUpdateTodoOrders(updates);
    } else {
      // Moving from one list to another
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Get the moved item
      const movedItem = event.container.data[event.currentIndex];

      // Update visual state based on destination list
      const newVisualState = event.container.id === 'doneList' ? 'completed' : 'pending';

      // Update visual state map
      this.visualStateMap.set(movedItem.id, newVisualState);

      // Update item's visual state
      movedItem.displayState = newVisualState;

      // Calculate new order values for all items in both lists
      event.container.data.forEach((item, index) => {
        updates.push({id: item.id, order: index});
      });

      event.previousContainer.data.forEach((item, index) => {
        updates.push({id: item.id, order: index});
      });

      // Send batch update to backend
      this.todoFacade.batchUpdateTodoOrders(updates);

      // Notify backend of status change
      this.todoFacade.toggleTodo(movedItem.id);
    }
  }

  /**
   * Deletes a to-do item locally and triggers backend deletion.
   * Updates local lists immediately for better user experience.
   *
   * @param id - ID of the to-do item to delete
   */
  deleteTodo(id: number): void {
    console.log('Deleting todo with ID:', id);

    // Add the ID to our local set of deleted IDs
    this.deletedIds.add(id);

    // Immediately update local lists to remove deleted item
    this.todo = this.todo.filter(item => item.id !== id);
    this.done = this.done.filter(item => item.id !== id);

    // Send delete request to backend via facade
    this.todoFacade.deleteTodo(id);
  }

  /**
   * Tracking function for ngFor directive to improve rendering performance.
   *
   * @param index - Index of the item in the array
   * @param item - To-do item to track
   * @returns Unique identifier for the item
   */
  trackTodo(index: number, item: DisplayTodoModel) {
    return item.id;
  }

  /**
   * Navigates to the add to-do page.
   */
  navigateToAdd(): void {
    this.router.navigate(['/app/todo/add']);
  }
}
