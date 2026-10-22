import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { provideRouter, Router } from '@angular/router';
import { ITodo } from '../../models/todo.model';
import { of, throwError } from 'rxjs';

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
    getTodos: vi.fn((_dueBefore?: string) => of(todos))
  };

  beforeEach(async () => {
    todoServiceMock.getTodos.mockReset();
    todoServiceMock.getTodos.mockImplementation(() => of(todos));

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

  it('AC1: should display the count of due todos fetched with the current time as ISO string', () => {
    const now = new Date('2026-10-22T06:16:42.815Z');
    const allTodos: ITodo[] = [1, 2, 3].map(n => ({
      id: String(n),
      title: `Todo ${n}`,
      description: `Description ${n}`,
      dueDate: '2026-10-10'
    }));
    const dueTodos = allTodos.slice(0, 2);
    todoServiceMock.getTodos.mockReset();
    todoServiceMock.getTodos.mockImplementation((dueBefore?: string) =>
      of(dueBefore ? dueTodos : allTodos)
    );

    vi.useFakeTimers();
    try {
      vi.setSystemTime(now);
      const dueFixture = TestBed.createComponent(TodoListComponent);
      dueFixture.detectChanges();

      expect(todoServiceMock.getTodos).toHaveBeenCalledWith(now.toISOString());
      const dueCount = dueFixture.nativeElement.querySelector('[data-testid="due-count"]');
      expect(dueCount).not.toBeNull();
      expect(dueCount.textContent).toContain('2');
    } finally {
      vi.useRealTimers();
    }
  });

  it('AC3: no-arg getTodos returns 3 todos, ISO-arg returns 2; before click 3 jl-todo-card; after click and detectChanges exactly 2 jl-todo-card matching the due todos', () => {
    const allTodos: ITodo[] = [1, 2, 3].map(n => ({
      id: String(n),
      title: `Todo ${n}`,
      description: `Description ${n}`,
      dueDate: '2026-10-10'
    }));
    const dueTodos = allTodos.slice(0, 2);
    todoServiceMock.getTodos.mockReset();
    todoServiceMock.getTodos.mockImplementation((dueBefore?: string) =>
      of(dueBefore ? dueTodos : allTodos)
    );
    const router = TestBed.inject(Router);
    const urlBefore = router.url;

    const dueFixture = TestBed.createComponent(TodoListComponent);
    dueFixture.detectChanges();
    const root: HTMLElement = dueFixture.nativeElement;

    expect(root.querySelectorAll('jl-todo-card').length).toBe(3);

    const dueCount = root.querySelector<HTMLButtonElement>('[data-testid="due-count"]');
    expect(dueCount).not.toBeNull();
    dueCount?.click();
    dueFixture.detectChanges();

    const cards = Array.from(root.querySelectorAll('jl-todo-card'));
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Todo 1');
    expect(cards[1].textContent).toContain('Todo 2');
    expect(root.textContent).not.toContain('Todo 3');
    expect(router.url).toBe(urlBefore);
  });

  it('AC10: should show an alert error and still render the full list when the due-todos request fails', () => {
    const allTodos: ITodo[] = [1, 2, 3].map(n => ({
      id: String(n),
      title: `Todo ${n}`,
      description: `Description ${n}`,
      dueDate: '2026-10-10'
    }));
    todoServiceMock.getTodos.mockReset();
    todoServiceMock.getTodos.mockImplementation((dueBefore?: string) =>
      dueBefore ? throwError(() => new Error('Due request failed')) : of(allTodos)
    );

    const errorFixture = TestBed.createComponent(TodoListComponent);
    errorFixture.detectChanges();
    const root: HTMLElement = errorFixture.nativeElement;

    const error = root.querySelector('[data-testid="due-error"]');
    expect(error).not.toBeNull();
    expect(error?.getAttribute('role')).toBe('alert');
    expect(root.querySelectorAll('jl-todo-card').length).toBe(3);
  });

  it('AC4: clicking the due-count twice shows the full list again', () => {
    const allTodos: ITodo[] = [1, 2, 3].map(n => ({
      id: String(n),
      title: `Todo ${n}`,
      description: `Description ${n}`,
      dueDate: '2026-10-10'
    }));
    todoServiceMock.getTodos.mockReset();
    todoServiceMock.getTodos.mockImplementation((dueBefore?: string) =>
      of(dueBefore ? allTodos.slice(0, 2) : allTodos)
    );

    const toggleFixture = TestBed.createComponent(TodoListComponent);
    toggleFixture.detectChanges();
    const root: HTMLElement = toggleFixture.nativeElement;
    const dueCount = root.querySelector<HTMLButtonElement>('[data-testid="due-count"]');

    dueCount?.click();
    toggleFixture.detectChanges();
    expect(root.querySelectorAll('jl-todo-card').length).toBe(2);

    dueCount?.click();
    toggleFixture.detectChanges();
    expect(root.querySelectorAll('jl-todo-card').length).toBe(3);
    expect(root.textContent).toContain('Todo 3');
  });

  it('AC5/6: deleting from a card reloads full and due lists and updates the count and list', () => {
    let allTodos: ITodo[] = [1, 2, 3].map(n => ({
      id: String(n),
      title: `Todo ${n}`,
      description: `Description ${n}`,
      dueDate: '2026-10-10'
    }));
    let dueTodos = allTodos.slice(0, 2);
    const deleteTodo = vi.fn((id: string) => {
      allTodos = allTodos.filter(t => t.id !== id);
      dueTodos = dueTodos.filter(t => t.id !== id);
      return of(undefined);
    });
    todoServiceMock.getTodos.mockReset();
    todoServiceMock.getTodos.mockImplementation((dueBefore?: string) =>
      of(dueBefore ? dueTodos : allTodos)
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: { ...todoServiceMock, getTodos: todoServiceMock.getTodos, deleteTodo } },
        provideRouter([])
      ]
    });
    const deleteFixture = TestBed.createComponent(TodoListComponent);
    deleteFixture.detectChanges();
    const root: HTMLElement = deleteFixture.nativeElement;
    expect(root.querySelectorAll('jl-todo-card').length).toBe(3);
    expect(root.querySelector('[data-testid="due-count"]')?.textContent).toContain('2');
    todoServiceMock.getTodos.mockClear();

    const firstCard = root.querySelector('jl-todo-card');
    firstCard?.querySelector<HTMLButtonElement>('button.btn-danger')?.click();
    deleteFixture.detectChanges();

    expect(deleteTodo).toHaveBeenCalledWith('1');
    expect(todoServiceMock.getTodos).toHaveBeenCalledTimes(2);
    expect(todoServiceMock.getTodos).toHaveBeenCalledWith();
    expect(todoServiceMock.getTodos).toHaveBeenCalledWith(expect.any(String));
    expect(root.querySelectorAll('jl-todo-card').length).toBe(2);
    expect(root.textContent).not.toContain('Todo 1');
    expect(root.querySelector('[data-testid="due-count"]')?.textContent).toContain('1');
  });

  it('deleting the last due todo while the due filter is active returns to the full list with a disabled 0 count', () => {
    const allBefore: ITodo[] = [1, 2, 3].map(n => ({
      id: String(n),
      title: `Todo ${n}`,
      description: `Description ${n}`,
      dueDate: '2026-10-10'
    }));
    const allAfter = allBefore.slice(1);
    const dueBefore = allBefore.slice(0, 1);
    let deleted = false;
    const deleteTodo = vi.fn(() => {
      deleted = true;
      return of(undefined);
    });
    todoServiceMock.getTodos.mockReset();
    todoServiceMock.getTodos.mockImplementation((dueBeforeIso?: string) => {
      if (dueBeforeIso) {
        return of(deleted ? [] : dueBefore);
      }
      return of(deleted ? allAfter : allBefore);
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: { getTodos: todoServiceMock.getTodos, deleteTodo } },
        provideRouter([])
      ]
    });
    const lastDueFixture = TestBed.createComponent(TodoListComponent);
    lastDueFixture.detectChanges();
    const root: HTMLElement = lastDueFixture.nativeElement;

    root.querySelector<HTMLButtonElement>('[data-testid="due-count"]')?.click();
    lastDueFixture.detectChanges();
    const dueCards = root.querySelectorAll('jl-todo-card');
    expect(dueCards.length).toBe(1);

    dueCards[0].querySelector<HTMLButtonElement>('button.btn-danger')?.click();
    lastDueFixture.detectChanges();

    expect(deleteTodo).toHaveBeenCalled();
    const cards = Array.from(root.querySelectorAll('jl-todo-card'));
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Todo 2');
    expect(cards[1].textContent).toContain('Todo 3');
    const dueCount = root.querySelector<HTMLButtonElement>('[data-testid="due-count"]');
    expect(dueCount?.textContent).toContain('0');
    expect(dueCount?.disabled).toBe(true);
  });

  it('AC11/12: add link targets /add-todo and card edit links target /edit-todo/:id', () => {
    const root: HTMLElement = fixture.nativeElement;
    const addLink = Array.from(root.querySelectorAll('a')).find(a =>
      a.textContent?.includes('Add New Todo')
    );
    expect(addLink?.getAttribute('href')).toBe('/add-todo');

    const editLink = root.querySelector('jl-todo-card a');
    expect(editLink?.getAttribute('href')).toBe('/edit-todo/1');
  });

  it('AC2: should show 0 as a disabled button when there are no due todos', () => {
    todoServiceMock.getTodos.mockReset();
    todoServiceMock.getTodos.mockImplementation((dueBefore?: string) =>
      of(dueBefore ? [] : todos)
    );

    const emptyFixture = TestBed.createComponent(TodoListComponent);
    emptyFixture.detectChanges();

    const dueCount: HTMLElement | null = emptyFixture.nativeElement.querySelector('[data-testid="due-count"]');
    expect(dueCount).not.toBeNull();
    expect(dueCount?.textContent).toContain('0');
    expect(dueCount?.tagName).toBe('BUTTON');
    expect((dueCount as HTMLButtonElement).disabled).toBe(true);
  });
});
