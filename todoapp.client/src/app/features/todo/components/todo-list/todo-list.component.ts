import { Component, computed, inject, signal } from '@angular/core';
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
  dueTodos = signal<ITodo[]>([]);
  dueError = signal<string | null>(null);
  showDueOnly = signal(false);
  visibleTodos = computed(() => (this.showDueOnly() ? this.dueTodos() : this.todos()));

  toggleDueOnly(): void {
    this.showDueOnly.update(value => !value);
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos.set(todos);
    });
    this.todoService.getTodos(new Date().toISOString()).subscribe({
      next: todos => {
        this.dueTodos.set(todos);
        this.dueError.set(null);
        if (todos.length === 0) {
          this.showDueOnly.set(false);
        }
      },
      error: (error: Error) => {
        this.dueError.set(error.message || 'Unable to load due todos.');
      },
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
