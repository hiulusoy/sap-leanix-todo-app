import {Routes} from '@angular/router';
import {TodoListComponent} from './pages/todo-list/todo-list.component';
import {TodoAddComponent} from './pages/todo-add/todo-add.component';


export const TodoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: TodoListComponent,
      },
      {
        path: 'add',
        component: TodoAddComponent,
      },
      {
        path: 'add/:id',
        component: TodoAddComponent,
      },
    ],
  },
];
