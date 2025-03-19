import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TodoCardComponent} from './todo-card.component';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('TodoCardComponent', () => {
  let component: TodoCardComponent;
  let fixture: ComponentFixture<TodoCardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    // Create spies for Router and MatDialog
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    // Mock dialog.open to return an object with afterClosed method
    mockDialog.open.and.returnValue({
      afterClosed: () => of(false) // Default to canceling the dialog
    } as any);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TodoCardComponent
      ],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: MatDialog, useValue: mockDialog}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // To ignore unknown elements in template
    }).compileComponents();

    fixture = TestBed.createComponent(TodoCardComponent);
    component = fixture.componentInstance;

    // Provide a mock todo item
    component.item = {
      id: 1,
      title: 'Test Todo',
      hasDueDate: false,
      dueDate: null
    };

    fixture.detectChanges();
  });

  it('should correctly identify overdue items', () => {
    // Set up an overdue item
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2); // 2 days ago

    component.item = {
      id: 1,
      title: 'Overdue Todo',
      hasDueDate: true,
      dueDate: pastDate.toISOString()
    };

    // Trigger lifecycle hook manually
    component.ngOnInit();

    // Check that dueStatus was set correctly
    expect(component.dueStatus).toBe('due-overdue');
  });

  it('should navigate to edit page when updateTodo is called', () => {
    // Create a mock event
    const event = jasmine.createSpyObj('Event', ['stopPropagation']);

    // Call the updateTodo method
    component.updateTodo(event);

    // Verify event propagation was stopped
    expect(event.stopPropagation).toHaveBeenCalled();

    // Verify router.navigate was called with correct route
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/todo/add', 1]);

    // Verify menu was closed
    expect(component.menuOpen).toBe(false);
  });
});
