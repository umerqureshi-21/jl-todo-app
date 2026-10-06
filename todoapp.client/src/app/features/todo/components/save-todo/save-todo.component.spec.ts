import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveTodoComponent } from './save-todo.component';
import { of } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { provideRouter } from '@angular/router';

describe('SaveTodoComponent', () => {
  let component: SaveTodoComponent;
  let fixture: ComponentFixture<SaveTodoComponent>;
  const todoServiceMock = {
    getTodoById: vi.fn(),
    addTodo: vi.fn(() => of({})),
    updateTodo: vi.fn(() => of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveTodoComponent],
      providers: [
        { 
          provide: TodoService, 
          useValue: todoServiceMock 
        },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SaveTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not load todo in add mode', () => {
  expect(todoServiceMock.getTodoById).not.toHaveBeenCalled();
  });
});
