import { Component, input, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { ITodo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  selector: 'jl-save-todo',
  styleUrl: './save-todo.component.css',
  templateUrl: './save-todo.component.html',
})
export class SaveTodoComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  todo = signal<ITodo>({
    id: '',
    title: '',
    description: '',
    dueDate: ''
  });

  editTodoId = input<string | undefined>();
  todoForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    description: '',
    dueDate: ['', Validators.required],
  });

  get title() {
    return this.todoForm.controls.title;
  }
  get description() {
    return this.todoForm.controls.description;
  }
  get dueDate() {
    return this.todoForm.controls.dueDate;
  }

  ngOnInit(): void {
    if (this.editTodoId()) {
      this.todoService.getTodoById(this.editTodoId()!)
        .subscribe({
          next: todo => {
            if (!todo || !todo.id) {
              this.router.navigate(['/todos']);
            } 
            this.todo.set(todo) 
            this.todoForm.patchValue(this.todo());
          }
        });   
    }
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const request$ = this.todo().id === ''
        ? this.todoService.addTodo(this.todoForm.value)
        : this.todoService.updateTodo({
          ...this.todoForm.value,
          id: this.editTodoId()!
        });

      request$.subscribe(() => {
        this.router.navigate(['/todos']);
      });
    }
  }
}