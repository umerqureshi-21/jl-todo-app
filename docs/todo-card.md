# todo-card

## Overview
`TodoCardComponent` is a client-side (Angular, standalone) presentational component. It displays a single todo (title, due date, description) and offers Edit and Delete actions. It holds no state and does not call the API; deletion is delegated to the parent through an output.

## Location
- Source: `todoapp.client/src/app/features/todo/components/todo-card/todo-card.component.ts`
- Template: `todoapp.client/src/app/features/todo/components/todo-card/todo-card.component.html`
- Styles: `todoapp.client/src/app/features/todo/components/todo-card/todo-card.component.css`
- Spec: `todoapp.client/src/app/features/todo/components/todo-card/todo-card.component.spec.ts`
- Model: `todoapp.client/src/app/features/todo/models/todo.model.ts`

## Public API
- Selector: `jl-todo-card`
- Input: `todo = input.required<ITodo>()` - the todo to display.
- Output: `deleted = output<string>()` - emits the todo id when Delete is clicked.
- Method: `deleteTodo(id: string): void` - emits `id` through `deleted`.

`ITodo`:
```ts
export interface ITodo {
	id?: string;
	title: string;
	description: string;
	dueDate: string;
}
```

## Dependencies
- `ITodo` model.
- `DatePipe` (`@angular/common`) to format the due date.
- `RouterLink` (`@angular/router`) for the Edit link.
- No injected services.

## Validation rules
None. The card only renders data; validation is handled by the save form and the server.

## Behavior and data flow
- Renders `title` in an `<h4>`, `dueDate` formatted as `dd MMMM yyyy hh:mm a` in an `<h6>`, and `description` in a `<p>`.
- The Edit button links to `['/edit-todo', todo().id]`.
- The Delete button is rendered only when `todo().id` is set. Clicking it calls `deleteTodo(id)`, which emits the id through `deleted`. The parent handles the actual deletion.

## Testing
`todo-card.component.spec.ts` (with `provideRouter([])` and a `todo` input set):
- `should create` - the component instantiates.
- `should emit todo id when deleteTodo is called` - `deleted` emits the id passed to `deleteTodo`.

## Usage example
```html
<jl-todo-card [todo]="todo" (deleted)="onDeleted($event)" />
```
