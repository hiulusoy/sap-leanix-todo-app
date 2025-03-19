import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @Input() startDateControlName: string = 'startDate';
  @Input() dueDateControlName: string = 'dueDate';

  constructor() {
  }

  ngOnInit(): void {
    this.ensureFormControls();

    this.setupValidation();
  }

  // Form kontrollerinin varlığını kontrol et ve gerekirse oluştu
  private ensureFormControls(): void {
    if (!this.parentForm) {
      console.error('Parent form is not provided to DateRangePickerComponent');
      return;
    }

    // Kontrol et, eğer formda belirtilen kontroller yoksa hata verme
    if (!this.parentForm.contains(this.startDateControlName)) {
      console.warn(`Form control with name "${this.startDateControlName}" doesn't exist in parent form.`);
    }

    if (!this.parentForm.contains(this.dueDateControlName)) {
      console.warn(`Form control with name "${this.dueDateControlName}" doesn't exist in parent form.`);
    }
  }

  private setupValidation(): void {
    // Get the control references
    const startDateControl = this.parentForm.get(this.startDateControlName);
    const dueDateControl = this.parentForm.get(this.dueDateControlName);

    if (startDateControl && dueDateControl) {
      // Subscribe to date changes to perform custom validation
      startDateControl.valueChanges.subscribe(() => this.validateDates());
      dueDateControl.valueChanges.subscribe(() => this.validateDates());
    }
  }

  private validateDates(): void {
    const startDateControl = this.parentForm.get(this.startDateControlName);
    const dueDateControl = this.parentForm.get(this.dueDateControlName);

    if (startDateControl && dueDateControl) {
      const startDate = startDateControl.value;
      const dueDate = dueDateControl.value;

      // Check if both dates are set
      if (startDate && dueDate) {
        // Only day comparison, removing time component
        const startDay = this.removeTimeFromDate(new Date(startDate));
        const dueDay = this.removeTimeFromDate(new Date(dueDate));

        // Validate start date is not after due date (can be same day)
        if (startDay > dueDay) { // Changed from >= to > to allow same-day
          dueDateControl.setErrors({dateRange: true});
        } else {
          // Clear the dateRange error if it exists
          if (dueDateControl.errors) {
            const errors = {...dueDateControl.errors};
            delete errors['dateRange'];

            dueDateControl.setErrors(Object.keys(errors).length ? errors : null);
          }
        }
      }
    }
  }

  // Helper method to remove time component from date for accurate day comparison
  private removeTimeFromDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  get startDateControl(): AbstractControl | null {
    return this.parentForm.get(this.startDateControlName);
  }

  get dueDateControl(): AbstractControl | null {
    return this.parentForm.get(this.dueDateControlName);
  }
}
