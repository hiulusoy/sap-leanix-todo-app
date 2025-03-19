import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  DeleteConfirmationDialogComponent
} from '../../../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatChip, MatChipSet } from '@angular/material/chips';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatChipSet,
    MatChip
  ],
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss']
})
export class TodoCardComponent implements OnInit {
  @Input() item: any;
  @Input() statusClass = '';
  @Output() delete = new EventEmitter<number>();

  menuOpen = false;
  dueStatus = ''; // Will hold 'due-approaching' or 'due-overdue' or ''

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.checkDueDate();
  }

  /**
   * Checks the due date and sets appropriate CSS class
   */
  checkDueDate(): void {
    if (!this.item.hasDueDate || !this.item.dueDate) {
      return;
    }

    const now = new Date();
    const dueDate = new Date(this.item.dueDate);

    // If due date has passed
    if (dueDate < now) {
      this.dueStatus = 'due-overdue';
      return;
    }

    // Calculate days until due date
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / millisecondsPerDay);

    // If due date is within 7 days
    if (daysUntilDue <= 7) {
      this.dueStatus = 'due-approaching';
    }
  }

  // Menüyü göster/gizle
  toggleMenu(event: Event): void {
    event.stopPropagation(); // Sürükleme işlemini engelleme
    this.menuOpen = !this.menuOpen;
  }

  // Güncelleme sayfasına yönlendir
  updateTodo(event: Event): void {
    event.stopPropagation(); // Menü tıklamasının kart sürüklemesini engellememesi için
    this.router.navigate(['/app/todo/add', this.item.id]);
    this.menuOpen = false;
  }

  // Silme işlemi için onay modalı göster
  deleteTodo(event: Event): void {
    event.stopPropagation(); // Menü tıklamasının kart sürüklemesini engellememesi için

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: { title: this.item.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Kullanıcı silme işlemini onayladı
        this.delete.emit(this.item.id);
      }
    });

    this.menuOpen = false;
  }

  // Kullanıcı belgede herhangi bir yere tıkladığında menüyü kapat
  @HostListener('document:click')
  closeMenu(): void {
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }
}
