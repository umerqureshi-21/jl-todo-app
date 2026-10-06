import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { provideRouter } from '@angular/router';
import { ITodo } from '../../models/todo.model';
import { of } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  const todos: ITodo[] = [
    {
      id: '1',
      title: 'Todo 1',
      description: 'Description 1',
      dueDate: '2026-10-10'
    }
  ];

  const todoServiceMock = {
    getTodos: vi.fn(() => of(todos))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
       providers: [
        {
          provide: TodoService,
          useValue: todoServiceMock
        },
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos from service', () => {
    expect(todoServiceMock.getTodos).toHaveBeenCalled();
    expect(component.todos()).toEqual(todos);
  });
});
