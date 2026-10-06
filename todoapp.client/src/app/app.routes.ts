import { Routes } from '@angular/router';
import { TodoListComponent } from './features/todo/components/todo-list/todo-list.component';
import { SaveTodoComponent } from './features/todo/components/save-todo/save-todo.component';

export const routes: Routes = [
    {path: '', redirectTo: '/todos', pathMatch: 'full'},
    {path: 'todos', component: TodoListComponent},
    {path: 'add-todo', component: SaveTodoComponent},
    {path: 'edit-todo/:editTodoId', component: SaveTodoComponent}
];
