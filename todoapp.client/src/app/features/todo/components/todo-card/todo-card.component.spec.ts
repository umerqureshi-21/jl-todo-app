import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoCardComponent } from './todo-card.component';
import { provideRouter } from '@angular/router';

describe('TodoCardComponent', () => {
  let component: TodoCardComponent;
  let fixture: ComponentFixture<TodoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('todo', {
      id: '123',
      title: 'Test Todo',
      description: 'Test description',
      dueDate: '2026-10-10'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit todo id when deleteTodo is called', () => {
    // Arrange
    let emittedId = '';
    let id = '123';
    component.deleted.subscribe(id => {
      emittedId = id;
    });

    // Act
    component.deleteTodo(id);
    
    // Assert
    expect(emittedId).toBe(id);
  });
});
