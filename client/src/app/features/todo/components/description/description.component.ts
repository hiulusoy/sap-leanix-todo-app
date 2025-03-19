import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {TodoFacade} from '../../+state/todo/todo.facade';
import {LabelModel} from '../../models/label.model';
import {DescriptionInputModel} from '../../models/description.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-description-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionFieldComponent implements OnInit, OnDestroy {
  @Input() parentForm!: FormGroup;
  @Input() formControlName: string = 'description';

  isGeneratingDescription = false;
  private subscriptions = new Subscription();
  private isUserInitiatedGeneration = false;

  // Minimum number of words required for keyword-based generation
  private readonly MIN_KEYWORDS = 3;

  constructor(
    private todoFacade: TodoFacade,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.parentForm) {
      console.error('Parent form is not provided to DescriptionFieldComponent');
      return;
    }

    if (!this.parentForm.contains(this.formControlName)) {
      console.warn(`Form control with name "${this.formControlName}" doesn't exist in parent form.`);
    }

    // Subscribe to the generated description, but only update when user has initiated
    this.subscriptions.add(
      this.todoFacade.generatedDescription$.subscribe(description => {
        if (description && this.isUserInitiatedGeneration) {
          // Update the description field with generated text
          this.parentForm.patchValue({
            [this.formControlName]: description
          });

          // Determine if generation was keyword-based
          const currentDescription = this.parentForm.get(this.formControlName)?.value;
          const isKeywordMode = this.wasKeywordMode(currentDescription);

          // Show different message based on mode
          const message = isKeywordMode ?
            'Description generated based on your keywords' :
            'Description generated based on task details';

          this.snackBar.open(message, 'OK', {
            duration: 3000
          });

          // Reset the flag after successful generation
          this.isUserInitiatedGeneration = false;
        }
      })
    );

    // Subscribe to loading state
    this.subscriptions.add(
      this.todoFacade.descriptionLoading$.subscribe(loading => {
        this.isGeneratingDescription = loading;

        // If loading stopped but no description was generated and user initiated, show error
        if (!loading && this.isUserInitiatedGeneration) {
          this.snackBar.open('Could not generate description', 'Close', {
            duration: 3000
          });
          this.isUserInitiatedGeneration = false;
        }
      })
    );

    // Subscribe to error state
    this.subscriptions.add(
      this.todoFacade.error$.subscribe(error => {
        if (error && this.isGeneratingDescription && this.isUserInitiatedGeneration) {
          console.error('Error generating description:', error);
          this.snackBar.open(`Error: ${error}`, 'Close', {
            duration: 3000
          });
          this.isGeneratingDescription = false;
          this.isUserInitiatedGeneration = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Generate description automatically based on the todo title and other context
   */
  generateDescription(): void {
    if (!this.parentForm) return;

    const title = this.parentForm.get('title')?.value;

    if (!title) {
      this.snackBar.open('Title is required for description generation', 'Close', {
        duration: 3000
      });
      return;
    }

    // Set flag that user has initiated generation
    this.isUserInitiatedGeneration = true;

    // Get description text from form if available
    const currentDescription = this.parentForm.get(this.formControlName)?.value;
    let keywords = '';
    let keywordMode = false;

    // Check if we have enough words for keyword-based generation
    if (currentDescription && currentDescription.trim()) {
      const words = currentDescription.trim().split(/\s+/);
      if (words.length >= this.MIN_KEYWORDS) {
        keywords = currentDescription.trim();
        keywordMode = true;
      }
    }

    // Collect other form data for context
    const priority = this.parentForm.get('priority')?.value;
    const startDate = this.parentForm.get('startDate')?.value;
    const dueDate = this.parentForm.get('dueDate')?.value;
    const state = this.parentForm.get('state')?.value;

    // Get labels if available
    let labels: string[] = [];
    if (this.parentForm.get('labels')?.value) {
      const formLabels = this.parentForm.get('labels')?.value;
      if (Array.isArray(formLabels) && formLabels.length > 0) {
        labels = formLabels.map((label: LabelModel | string) => {
          return typeof label === 'string' ? label : label.name;
        });
      }
    }

    const input: DescriptionInputModel = {
      title,
      keywords,
      priority,
      startDate,
      dueDate,
      labels,
      state
    };

    // Use the facade to dispatch the action
    this.todoFacade.generateDescription(input);
  }

  /**
   * Check if there are enough keywords entered for keyword-based generation
   */
  hasEnoughKeywords(): boolean {
    const currentDescription = this.parentForm?.get(this.formControlName)?.value;
    if (!currentDescription) return false;

    const words = currentDescription.trim().split(/\s+/);
    return words.length >= this.MIN_KEYWORDS;
  }

  /**
   * Determine if the generation was keyword-based
   */
  private wasKeywordMode(description: string | null): boolean {
    if (!description) return false;

    const words = description.trim().split(/\s+/);
    return words.length >= this.MIN_KEYWORDS;
  }
}
