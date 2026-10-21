# save-todo

## Overview
`SaveTodoComponent` is a client-side (Angular, standalone) form component used for both adding and editing a todo. In edit mode it loads the todo from the API and pre-fills the form. On a valid submit it creates or updates the todo, then navigates to `/todos`.

## Location
- Source: `todoapp.client/src/app/features/todo/components/save-todo/save-todo.component.ts`
- Template: `todoapp.client/src/app/features/todo/components/save-todo/save-todo.component.html`
- Styles: `todoapp.client/src/app/features/todo/components/save-todo/save-todo.component.css`
- Spec: `todoapp.client/src/app/features/todo/components/save-todo/save-todo.component.spec.ts`
- Model: `todoapp.client/src/app/features/todo/models/todo.model.ts`
- Service: `todoapp.client/src/app/features/todo/services/todo.service.ts`
- Routes: `todoapp.client/src/app/app.routes.ts`

## Public API
- Selector: `jl-save-todo`
- Input: `editTodoId = input<string | undefined>()` - id of the todo to edit. It is bound from the `:editTodoId` route parameter (`withComponentInputBinding()` in `app.config.ts`). When unset, the component is in add mode.
- Signal: `todo = signal<ITodo>({ id: '', title: '', description: '', dueDate: '' })` - the loaded todo; an empty `id` means add mode.
- Form: `todoForm` (non-nullable `FormGroup`) with controls `title`, `description`, `dueDate`.
- Getters: `title`, `description`, `dueDate` - shortcuts to the form controls.
- `ngOnInit(): void` - in edit mode, loads the todo and patches the form.
- `onSubmit(): void` - saves the todo if the form is valid.

## Dependencies
- `TodoService` (`getTodoById`, `addTodo`, `updateTodo`)
- `FormBuilder`, `ReactiveFormsModule`, `Validators`
- `Router`, `RouterLink`
- `CommonModule`
- `ITodo` model

## Validation rules
- Title: required; `maxlength="100"` in the template.
- Description: optional; `maxlength="500"` in the template.
- Due Date: required.
- The Save button is disabled while the form is invalid. "Title is required" and "Due Date is required" appear once the field has been touched.
- Only `Validators.required` is on the form controls; the max lengths are enforced by the HTML `maxlength` attributes.

## Behavior and data flow
- Routes: `add-todo` (add mode) and `edit-todo/:editTodoId` (edit mode). The heading shows "Edit Todo" or "Add Todo" depending on `editTodoId()`.
- Edit mode: `ngOnInit` calls `GET api/todos/{id}`. If the result is empty or has no `id`, the component navigates to `/todos`. Otherwise it sets `todo` and patches the form.
- Submit: if the form is valid, the component calls `addTodo` (`POST api/todos`) when `todo().id === ''`. Otherwise it calls `updateTodo` (`PUT api/todos/{id}`) with the form values and `editTodoId`. After the request succeeds, it navigates to `/todos`.
- Cancel is a link to `/todos`.
- HTTP errors are turned into `Error` objects by `TodoService`. The component has no error handler of its own.

## Testing
`save-todo.component.spec.ts` (mocked `TodoService` with Vitest `vi.fn`, `provideRouter([])`):
- `should create` - the component instantiates.
- `should not load todo in add mode` - `getTodoById` is not called when no `editTodoId` is set.

## Usage example
```ts
// app.routes.ts
{ path: 'add-todo', component: SaveTodoComponent },
{ path: 'edit-todo/:editTodoId', component: SaveTodoComponent }
```
```html
<a routerLink="/add-todo">Add</a>
<a [routerLink]="['/edit-todo', todo.id]">Edit</a>
```
