import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TodoRoutes} from './todo.routing';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TodoListComponent} from './pages/todo-list/todo-list.component';
import {TodoAddComponent} from './pages/todo-add/todo-add.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {LabelEffects} from './+state/label/label.effects';
import {labelReducer} from './+state/label/label.reducer';

import {TodoFormComponent} from './components/todo-form/todo-form.component';
import {TodoCardComponent} from './components/todo-card/todo-card.component';
import {TodoEffects, todoReducer} from './+state';

@NgModule({
  declarations: [
    TodoListComponent,
    TodoAddComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(TodoRoutes),
    DragDropModule,
    StoreModule.forFeature('todos', todoReducer),
    StoreModule.forFeature('labels', labelReducer),
    EffectsModule.forFeature([TodoEffects, LabelEffects]),

    TodoFormComponent,
    TodoCardComponent,
  ]
})
export class TodoModule {
}
