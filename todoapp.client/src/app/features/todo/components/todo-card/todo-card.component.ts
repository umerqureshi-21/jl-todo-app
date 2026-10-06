import { Component, input, output } from '@angular/core';
import { ITodo } from '../../models/todo.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'jl-todo-card',
  styleUrl: './todo-card.component.css',
  templateUrl: './todo-card.component.html',
})
export class TodoCardComponent {
  todo= input.required<ITodo>();
  deleted=output<string>();
  
  deleteTodo(id: string) {  
      this.deleted.emit(id);  
  } 
}

