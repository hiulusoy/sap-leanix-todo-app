import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TodoAddComponent} from './todo-add.component';
import {TodoFacade} from '../../+state/todo/todo.facade';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, NO_ERRORS_SCHEMA, Output} from '@angular/core';
import {TodoModel} from '../../models/todo.model';
import {of} from 'rxjs';
import {TodoPriority} from '../../../../../../../server/modules/todo/enums/todo-priority.enum';

// Create a mock for TodoFormComponent
@Component({
  selector: 'app-todo-form',
  template: '',
  standalone: true
})
class MockTodoFormComponent {
  @Input() todoData: any;
  @Input() isEditMode: boolean = false;
  @Output() submitted = new EventEmitter<Partial<TodoModel>>();
}

describe('TodoAddComponent', () => {
  let component: TodoAddComponent;
  let fixture: ComponentFixture<TodoAddComponent>;
  let mockTodoFacade: jasmine.SpyObj<TodoFacade>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  // Test data
  const mockTodo: TodoModel = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    state: 'pending',
    priority: TodoPriority.Medium,
    active: true,
    labels: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(async () => {
    // Create spies for the services
    mockTodoFacade = jasmine.createSpyObj('TodoFacade', ['loadTodoById', 'createTodo', 'updateTodo']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Configure the behavior of the selectedTodo$ observable
    mockTodoFacade.selectedTodo$ = of(mockTodo);

    await TestBed.configureTestingModule({
      declarations: [
        TodoAddComponent
      ],
      imports:[MockTodoFormComponent],
      providers: [
        { provide: TodoFacade, useValue: mockTodoFacade },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}) // Default to empty params (create mode)
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoAddComponent);
    component = fixture.componentInstance;
  });

  it('should initialize in create mode when no ID parameter is present', () => {
    fixture.detectChanges();

    expect(component.isEditMode).toBeFalse();
    expect(component.todoId).toBeNull();
    expect(component.currentTodo).toBeNull();
    expect(mockTodoFacade.loadTodoById).not.toHaveBeenCalled();
  });

  it('should initialize in edit mode and load todo data when ID parameter is present', () => {
    // Reconfigure the ActivatedRoute to include an ID
    TestBed.resetTestingModule();
    mockActivatedRoute = { params: of({ id: '1' }) };

    TestBed.configureTestingModule({
      declarations: [
        TodoAddComponent,
      ],
      imports: [MockTodoFormComponent],
      providers: [
        { provide: TodoFacade, useValue: mockTodoFacade },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEditMode).toBeTrue();
    expect(component.todoId).toBe(1);
    expect(mockTodoFacade.loadTodoById).toHaveBeenCalledWith(1);
    expect(component.currentTodo).toEqual(jasmine.objectContaining({
      id: 1,
      title: 'Test Todo'
    }));
  });

  it('should create a new todo when form is submitted in create mode', () => {
    fixture.detectChanges();

    const newTodoData: Partial<TodoModel> = {
      title: 'New Todo',
      description: 'New Description',
      state: 'pending',
      priority: TodoPriority.High
    };

    component.onFormSubmitted(newTodoData);

    expect(mockTodoFacade.createTodo).toHaveBeenCalledWith(newTodoData);
    expect(mockTodoFacade.updateTodo).not.toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/todo/list']);
  });

  it('should update an existing todo when form is submitted in edit mode', () => {
    // Setup edit mode
    component.isEditMode = true;
    component.todoId = 1;
    fixture.detectChanges();

    const updatedTodoData: Partial<TodoModel> = {
      title: 'Updated Todo',
      description: 'Updated Description',
      state: 'completed',
      priority: TodoPriority.Low
    };

    component.onFormSubmitted(updatedTodoData);

    expect(mockTodoFacade.updateTodo).toHaveBeenCalledWith(1, updatedTodoData);
    expect(mockTodoFacade.createTodo).not.toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/todo/list']);
  });
});
