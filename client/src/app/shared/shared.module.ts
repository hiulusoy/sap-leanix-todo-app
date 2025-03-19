import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
  DeleteConfirmationDialogComponent
} from './components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import {SpinnerComponent} from './components/spinner/spinner.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, DeleteConfirmationDialogComponent, SpinnerComponent],
  declarations: [],
  exports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {
}
