import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRangePickerComponent } from './date-range-picker.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;
  let parentForm: FormGroup;

  beforeEach(async () => {
    // Create a parent form with start and due date controls
    parentForm = new FormGroup({
      startDate: new FormControl(null),
      dueDate: new FormControl(null)
    });

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        DateRangePickerComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    component.parentForm = parentForm;
    fixture.detectChanges();
  });

  it('should validate that start date cannot be after due date', () => {
    // Set start date after due date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10); // 10 days in the future

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10); // 10 days in the past

    // Set values
    parentForm.get('startDate')?.setValue(futureDate);
    parentForm.get('dueDate')?.setValue(pastDate);
    fixture.detectChanges();

    // Check that the due date control has an error
    expect(parentForm.get('dueDate')?.hasError('dateRange')).toBeTrue();
  });

  it('should not report error when start and due date are valid', () => {
    // Set start date before due date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5); // 5 days in the past

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5); // 5 days in the future

    // Set values
    parentForm.get('startDate')?.setValue(startDate);
    parentForm.get('dueDate')?.setValue(dueDate);
    fixture.detectChanges();

    // Check that the due date control has no errors
    expect(parentForm.get('dueDate')?.hasError('dateRange')).toBeFalse();
    expect(parentForm.get('dueDate')?.valid).toBeTrue();
  });
});
