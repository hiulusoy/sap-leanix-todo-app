import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BrowserModule} from '@angular/platform-browser';
import {AppLayoutComponent} from './core/layout/app-layout/app-layout.component';
import {environment} from '../environments/environement';


const routes: Routes = [
  {
    path: environment.PATH_APP,
    component: AppLayoutComponent,
    children: [
      {
        path: environment.PATH_TODO,
        loadChildren: () => import('./features/todo/todo.module').then((m) => m.TodoModule),
        canActivate: [],
      },
    ],
  },

];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
