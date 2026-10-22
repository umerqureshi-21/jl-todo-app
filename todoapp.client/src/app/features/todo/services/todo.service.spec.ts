import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('AC7: getTodos(dueBefore) sends dueBefore ISO string as a query param', () => {
    const dueBefore = '2026-10-22T06:14:56.231Z';

    service.getTodos(dueBefore).subscribe();

    const req = httpMock.expectOne((r) => r.url === 'api/todos');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('dueBefore')).toBe(dueBefore);
    req.flush([]);
  });
});
