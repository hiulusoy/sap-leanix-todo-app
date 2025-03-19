import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LabelFacade } from '../../+state/label/label.facade';
import { LabelModel } from '../../models/label.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

/**
 * Component for managing and selecting labels with chip UI
 */
@Component({
  selector: 'app-label-chip',
  standalone: true,
  templateUrl: './label-chip.component.html',
  styleUrl: './label-chip.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIcon
  ]
})
export class LabelChipComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /**
   * Currently selected labels
   */
  @Input() selectedLabels: string[] = [];

  /**
   * Event emitter for when selected labels change
   */
  @Output() selectedLabelsChange = new EventEmitter<string[]>();

  /**
   * Reference to the input element
   */
  @ViewChild('labelInput') labelInput!: ElementRef<HTMLInputElement>;

  /**
   * Reference to the chip list
   */
  @ViewChild('chipList') chipList: any;

  /**
   * Available labels from the backend
   */
  availableLabels: LabelModel[] = [];

  /**
   * Current value of the new label input
   */
  newLabelName = '';

  /**
   * Key codes that will trigger a new label to be added
   */
  readonly separatorKeysCodes: readonly number[] = [ENTER, COMMA];

  /**
   * Subject for handling unsubscription on component destroy
   */
  private readonly destroy$ = new Subject<void>();

  /**
   * Flag to track if component has been initialized
   */
  isInitialized = false;

  constructor(private labelFacade: LabelFacade) {}

  /**
   * Initialize component and load labels from backend
   */
  ngOnInit(): void {
    this.loadLabels();
  }

  /**
   * After view is initialized, set component as initialized and reset form state
   */
  ngAfterViewInit(): void {
    this.isInitialized = true;
    this.resetFormFieldState();
  }

  /**
   * React to changes in inputs
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.handleSelectedLabelsChange(changes);
  }

  /**
   * Clean up subscriptions on component destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Add a label from input field event
   */
  addLabelFromInput(event: MatChipInputEvent): void {
    const value = this.sanitizeInputValue(event.value);

    if (value) {
      this.addLabel(value);
    }

    this.clearInputField(event);
  }

  /**
   * Handle selection from autocomplete dropdown
   */
  selectLabel(event: MatAutocompleteSelectedEvent): void {
    const labelName = event.option.viewValue;

    if (this.isNewLabel(labelName)) {
      this.addLabel(labelName);
    }

    this.clearInputValue();
  }

  /**
   * Add a label to the selected labels list
   */
  addLabel(name: string): void {
    if (!name) return;

    this.createLabelIfNeeded(name);
    this.addToSelectedLabelsIfNew(name);
  }

  /**
   * Remove a label by index
   */
  removeLabel(index: number): void {
    this.selectedLabels.splice(index, 1);
    this.notifyLabelChange();
  }

  /**
   * Filter available labels based on input
   */
  getFilteredLabels(): LabelModel[] {
    if (!this.newLabelName) {
      return this.availableLabels;
    }

    return this.filterLabelsByName(this.newLabelName);
  }

  /**
   * Load labels from the backend
   */
  private loadLabels(): void {
    this.labelFacade.loadLabels();

    this.labelFacade.labels$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) =>
          JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe({
        next: (labels) => this.availableLabels = labels,
        error: (err) => console.error('Failed to load labels:', err)
      });
  }

  /**
   * Handle changes to selectedLabels input
   */
  private handleSelectedLabelsChange(changes: SimpleChanges): void {
    const hasSelectedLabelsChanged = changes['selectedLabels'] && this.isInitialized;

    if (hasSelectedLabelsChanged) {
      setTimeout(() => {
        this.resetFormFieldState();
      });
    }
  }

  /**
   * Reset the form field state
   */
  private resetFormFieldState(): void {
    this.resetInputElement();
    this.blurInputIfFocused();
    this.newLabelName = '';
  }

  /**
   * Reset the input element value
   */
  private resetInputElement(): void {
    if (this.labelInput?.nativeElement) {
      this.labelInput.nativeElement.value = '';
    }
  }

  /**
   * Blur the input if it's currently focused
   */
  private blurInputIfFocused(): void {
    const inputElement = this.labelInput?.nativeElement;
    if (document.activeElement === inputElement) {
      inputElement.blur();
    }
  }

  /**
   * Sanitize input value by trimming whitespace
   */
  private sanitizeInputValue(value?: string): string {
    return (value || '').trim();
  }

  /**
   * Clear input field after adding a label
   */
  private clearInputField(event: MatChipInputEvent): void {
    this.newLabelName = '';

    if (event.chipInput) {
      event.chipInput.clear();
    }
  }

  /**
   * Clear input value after selecting from autocomplete
   */
  private clearInputValue(): void {
    this.newLabelName = '';

    if (this.labelInput?.nativeElement) {
      this.labelInput.nativeElement.value = '';
    }
  }

  /**
   * Check if a label is not already in the selected labels
   */
  private isNewLabel(name: string): boolean {
    return !this.selectedLabels.includes(name);
  }

  /**
   * Create a new label if it doesn't already exist
   */
  private createLabelIfNeeded(name: string): void {
    this.labelFacade.createLabel(name);
  }

  /**
   * Add label to selected labels if not already present
   */
  private addToSelectedLabelsIfNew(name: string): void {
    if (this.isNewLabel(name)) {
      this.selectedLabels = [...this.selectedLabels, name];
      this.notifyLabelChange();
    }
  }

  /**
   * Notify parent component of label changes
   */
  private notifyLabelChange(): void {
    this.selectedLabelsChange.emit([...this.selectedLabels]);
  }

  /**
   * Filter labels by name
   */
  private filterLabelsByName(filterValue: string): LabelModel[] {
    const lowercaseFilter = filterValue.toLowerCase();
    return this.availableLabels.filter(label =>
      label.name.toLowerCase().includes(lowercaseFilter)
    );
  }
}
