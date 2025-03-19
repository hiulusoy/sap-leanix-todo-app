import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionFieldComponent } from './description.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoFacade } from '../../+state/todo/todo.facade';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Create mock for MatSnackBar
const snackBarMock = {
  open: jasmine.createSpy('open')
};

// Create mock for TodoFacade
const todoFacadeMock = {
  generatedDescription$: of(null),
  descriptionLoading$: of(false),
  error$: of(null),
  generateDescription: jasmine.createSpy('generateDescription')
};

describe('DescriptionFieldComponent', () => {
  let component: DescriptionFieldComponent;
  let fixture: ComponentFixture<DescriptionFieldComponent>;
  let parentForm: FormGroup;

  beforeEach(async () => {
    // Reset spies
    snackBarMock.open.calls.reset();
    todoFacadeMock.generateDescription.calls.reset();

    // Create a parent form with necessary controls
    parentForm = new FormGroup({
      title: new FormControl('Test Title'),
      description: new FormControl(''),
      priority: new FormControl('Medium'),
      startDate: new FormControl(null),
      dueDate: new FormControl(null),
      state: new FormControl('pending'),
      labels: new FormControl([])
    });

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        DescriptionFieldComponent
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: TodoFacade, useValue: todoFacadeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionFieldComponent);
    component = fixture.componentInstance;
    component.parentForm = parentForm;
    component.formControlName = 'description';
    fixture.detectChanges();
  });

  it('should generate description when title is present', () => {
    // Call the method to generate description
    component.generateDescription();

    // Verify the facade method was called with the correct parameters
    expect(todoFacadeMock.generateDescription).toHaveBeenCalled();
    const callArgs = todoFacadeMock.generateDescription.calls.mostRecent().args[0];
    expect(callArgs.title).toBe('Test Title');
    expect(callArgs.keywords).toBe('');
  });

  it('should detect keyword mode when enough words are present', () => {
    // Set description with enough keywords
    parentForm.get('description')?.setValue('keyword1 keyword2 keyword3 keyword4');
    fixture.detectChanges();

    // Verify keyword detection
    expect(component.hasEnoughKeywords()).toBeTrue();

    // Call generate description
    component.generateDescription();

    // Verify the facade method was called with keywords
    expect(todoFacadeMock.generateDescription).toHaveBeenCalled();
    const callArgs = todoFacadeMock.generateDescription.calls.mostRecent().args[0];
    expect(callArgs.keywords).toBe('keyword1 keyword2 keyword3 keyword4');
  });
});
