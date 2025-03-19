import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {TodoModel} from '../../models/todo.model';
import {LabelChipComponent} from '../label-selection/label-chip.component';
import {DateRangePickerComponent} from '../date-range-picker/date-range-picker.component';
import {LabelModel} from '../../models/label.model';
import {TodoPriority} from '../../enums/todo-priority.enum';
import {DescriptionFieldComponent} from '../description/description.component';

@Component({
  standalone: true,
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    LabelChipComponent,
    DateRangePickerComponent,
    DescriptionFieldComponent
  ],
})
export class TodoFormComponent implements OnInit, OnChanges {
  /**
   * The existing todo data to edit, or null for creating a new todo.
   */
  @Input() todoData: TodoModel | null = null;

  /**
   * Flag to indicate if the component is in edit mode.
   * When true, the form is initialized with existing todo data.
   * When false, a new empty form is displayed.
   */
  @Input() isEditMode = false;

  /**
   * Event emitter that triggers when the form is submitted.
   * Emits a Partial<TodoModel> object containing the form data.
   */
  @Output() submitted = new EventEmitter<Partial<TodoModel>>();

  /**
   * Array of labels selected for the current todo.
   */
  formLabels: LabelModel[] = [];

  /**
   * The form group containing all form controls for the todo.
   */
  todoForm!: FormGroup;

  /**
   * Flag to indicate if the todo has a due date.
   * When true, date controls are enabled.
   */
  hasDueDate = false;

  /**
   * The title displayed at the top of the form.
   * Changes based on whether the form is in edit mode or create mode.
   */
  pageTitle = 'Add New Todo';

  /**
   * Array of available priority options for the todo.
   * Populated from the TodoPriority enum.
   */
  priorities = Object.values(TodoPriority);

  /**
   * Creates an instance of TodoFormComponent.
   *
   * @param {FormBuilder} fb - The Angular FormBuilder service for creating form controls
   */
  constructor(private fb: FormBuilder) {
  }

  /**
   * Lifecycle hook that is called after component initialization.
   * Initializes the form and sets up subscription to form value changes.
   */
  ngOnInit(): void {
    this.initForm();

    // Listen for hasDueDate changes
    this.todoForm.get('hasDueDate')?.valueChanges.subscribe(value => {
      console.log('hasDueDate changed:', value);
      this.hasDueDate = value;
      if (!value) {
        this.todoForm.patchValue({startDate: null, dueDate: null});
      }
    });
  }

  /**
   * Lifecycle hook that is called when the component's input properties change.
   * Handles updates to todoData and isEditMode inputs.
   *
   * @param {SimpleChanges} changes - Object containing changed properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    // If todoData changes and the form is initialized, update the form
    if (changes['todoData'] && this.todoForm) {
      console.log('Patching form with todo data:', this.todoData);
      this.patchFormWithTodoData();
    }

    // Update page title based on mode
    if (changes['isEditMode']) {
      this.pageTitle = this.isEditMode ? 'Edit Todo' : 'Add New Todo';
    }
  }

  /**
   * Initializes the form with default values or existing todo data.
   * Creates form controls with validators for required fields.
   *
   * @private
   */
  private initForm(): void {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      state: ['pending', [Validators.required]],
      priority: [TodoPriority.Medium, [Validators.required]],
      hasDueDate: [false],
      startDate: [null],
      dueDate: [null],
      labels: [[]],
    });

    // If we have todo data on init, patch the form
    if (this.todoData) {
      this.patchFormWithTodoData();
    }
  }

  /**
   * Updates the form with existing todo data for editing.
   * Converts date strings to Date objects and initializes labels.
   *
   * @private
   */
  private patchFormWithTodoData(): void {
    if (!this.todoData) return;

    console.log('Patching form with todo data:', this.todoData);

    this.hasDueDate = this.todoData.hasDueDate || false;

    // Convert date strings to Date objects if needed
    const startDate = this.todoData.startDate ? new Date(this.todoData.startDate) : null;
    const dueDate = this.todoData.dueDate ? new Date(this.todoData.dueDate) : null;

    // Initialize labels if they exist
    if (this.todoData.labels && this.todoData.labels.length > 0) {
      console.log('Setting labels from todo data:', this.todoData.labels);
      this.formLabels = [...this.todoData.labels];
    } else {
      console.log('No labels found in todo data, using empty array');
      this.formLabels = [];
    }

    // Patch the form with todo data
    this.todoForm.patchValue({
      title: this.todoData.title || '',
      description: this.todoData.description || '',
      state: this.todoData.state || 'pending',
      priority: this.todoData.priority || TodoPriority.Medium,
      hasDueDate: this.hasDueDate,
      startDate: startDate,
      dueDate: dueDate,
      labels: this.formLabels
    });

    console.log('Form patched with values:', this.todoForm.value);
    console.log('Form labels after patch:', this.formLabels);
  }

  /**
   * Handles form submission. If the form is valid, collects the data
   * and emits it via the submitted event emitter. In create mode,
   * resets the form after submission.
   */
  onSubmit(): void {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      const todoToSubmit: Partial<TodoModel> = {
        title: formValue.title,
        description: formValue.description,
        state: formValue.state,
        priority: formValue.priority,
        hasDueDate: formValue.hasDueDate,
        startDate: formValue.startDate,
        dueDate: formValue.dueDate,
        labels: this.formLabels,
        active: true,
      };

      // If in edit mode, preserve the ID
      if (this.isEditMode && this.todoData) {
        todoToSubmit.id = this.todoData.id;
      }

      console.log('Submitting todo with data:', todoToSubmit);
      this.submitted.emit(todoToSubmit);

      if (!this.isEditMode) {
        // Only reset the form if adding a new todo
        this.resetForm();
      }
    } else {
      this.todoForm.markAllAsTouched();
    }
  }

  /**
   * Resets the form to default values.
   * Clears all form fields and resets the label array.
   */
  resetForm(): void {
    this.todoForm.reset({
      title: '',
      description: '',
      state: 'pending',
      priority: TodoPriority.Medium,
      hasDueDate: false,
      startDate: null,
      dueDate: null,
      labels: []
    });
    this.formLabels = [];
  }

  /**
   * Handles changes to the hasDueDate checkbox.
   * When unchecked, clears the date fields.
   *
   * @param {boolean} checked - Whether the checkbox is checked
   */
  onHasDueDateChange(checked: boolean): void {
    this.hasDueDate = checked;
    if (!checked) {
      this.todoForm.patchValue({startDate: null, dueDate: null});
    }
  }

  /**
   * Handles changes to the selected labels.
   * Updates the internal label array and the form value.
   *
   * @param {LabelModel[]} labels - Array of selected labels
   */
  onLabelsChange(labels: LabelModel[]): void {
    console.log('Labels changed:', labels);
    this.formLabels = labels;
    this.todoForm.patchValue({labels});
  }
}
