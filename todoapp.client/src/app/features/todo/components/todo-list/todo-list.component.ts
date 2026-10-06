import { Component, inject, signal } from '@angular/core';
import { ITodo } from '../../models/todo.model';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { TodoService } from '../../services/todo.service';
import { RouterModule } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  imports: [TodoCardComponent, RouterModule],
  selector: 'jl-todo-list',
  styleUrl: './todo-list.component.css',
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent implements OnInit {
  todoService = inject(TodoService);
  todos = signal<ITodo[]>([]);

  ngOnInit(): void {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos.set(todos);
    });
  }

  onDeleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.loadTodos();
      }
    });
  }
}
