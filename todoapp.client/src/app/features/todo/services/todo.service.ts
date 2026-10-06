import { Service, inject } from '@angular/core';
import { ITodo } from '../models/todo.model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Service()
export class TodoService {

    private readonly baseUrl = 'api';
    private readonly http= inject(HttpClient);
    
    getTodos() : Observable<ITodo[]> {
         return this.http.get<ITodo[]>(this.baseUrl + '/todos').pipe(
            catchError(this.handleError)
        );
    }

    getTodoById(todoId: string): Observable<ITodo> {
        return this.http.get<ITodo>(this.baseUrl + '/todos/' + todoId).pipe(
            catchError(this.handleError)
        );
    }

    addTodo(todo: Partial<ITodo>): Observable<ITodo> {
        return this.http.post<ITodo>(this.baseUrl + '/todos', todo).pipe(
            catchError(this.handleError)
        )
    }

    deleteTodo(todoId: string): Observable<void> {
        return this.http.delete<void>(this.baseUrl + '/todos/' + todoId).pipe(
            catchError(this.handleError)
        );
    }
    
    updateTodo(todo: Partial<ITodo>): Observable<ITodo> {
        return this.http.put<ITodo>(this.baseUrl + '/todos/' + todo.id, todo).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';
        if (error.status===0) {
            errorMessage = 'Client or network error occurred';
        } else {
            errorMessage = `Server returned code ${error.status} - ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
    }   
}
