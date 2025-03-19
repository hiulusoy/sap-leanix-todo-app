import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TodoModule} from './todo/todo.module';


@NgModule({
  imports: [
    CommonModule,
    TodoModule,
  ],
  exports: [
    TodoModule,
  ]
})
export class FeaturesModule { }
