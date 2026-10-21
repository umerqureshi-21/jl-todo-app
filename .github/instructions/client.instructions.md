---
description: Angular 22 client conventions for components, forms, services, styling and Vitest specs.
applyTo: "todoapp.client/**/*.ts,todoapp.client/**/*.html,todoapp.client/**/*.css,todoapp.client/**/*.js,todoapp.client/**/*.json"
---
# Client (Angular 22) conventions

## Structure and naming
- Feature-based layout: `src/app/features/<feature>/{components,services,models}`.
- File names: `<name>.component.ts|html|css`, `<name>.service.ts`, `<name>.model.ts`, with `.spec.ts` next to the source.
- Component selector prefix: `jl-` (e.g. `jl-todo-card`). Class names end in `Component`.
- Interfaces use an `I` prefix (`ITodo`). Models are interfaces, not classes.
- Import paths are relative. Remove unused imports.

## Angular patterns
- Standalone components only (no NgModules). Declare dependencies in `imports`.
- Bootstrap with `bootstrapApplication(App, appConfig)`. Register providers in `app.config.ts` (`provideRouter(routes, withComponentInputBinding())`, plus `provideHttpClient()` for HTTP).
- Use `inject()` for DI. Mark injected fields `private readonly` unless the template needs them.
- Use signals for state (`signal`, `.set`). Use `input()`, `input.required()` and `output()` instead of decorators.
- Route params bind to component inputs (e.g. `editTodoId = input<string>()`).
- Use built-in control flow (`@if`, `@else`, `@for ... track item.id`). Do not use `*ngIf` or `*ngFor`.
- Import only what the template needs (`DatePipe`, `RouterLink`). Do not import `CommonModule`.
- Routes live in `app.routes.ts`. Default route redirects to `/todos`.

## Component roles
- Container components (e.g. `TodoListComponent`) load data through services and handle events.
- Presentational components (e.g. `TodoCardComponent`) take inputs and emit outputs only. No service calls.
- One form component handles add and edit (`SaveTodoComponent`). Decide the mode from `editTodoId()`.

## Forms
- Typed reactive forms with `FormBuilder.nonNullable.group`.
- Expose controls via getters for the template.
- Show validation messages only when `touched`. Disable submit while invalid.
- Mirror server limits with `maxlength` and `Validators`.
- Return after navigating away on missing data.

## HTTP and services
- Services use `@Service()`, `inject(HttpClient)` and a `private readonly` base URL (relative `api`).
- Methods return `Observable<T>` and pipe through a shared `catchError(handleError)`.
- `handleError` rethrows a user-friendly `Error`. Components must subscribe with `next`/`error` handlers and surface errors to the user.
- Use `Partial<ITodo>` for create and update payloads.
- Do not hardcode URLs in components. Keep them in services (or config).

## Styling and tooling
- Bootstrap 5 utility classes and components (`container`, `btn btn-primary`, `border rounded p-3`, `mb-3`, `form-control`).
- Keep component CSS small (budgets: 4kB warning, 8kB error).
- Format with Prettier. TypeScript strict flags are on (`noImplicitReturns`, `noImplicitOverride`, etc.). Do not suppress them.
- Dev proxy: `src/proxy.conf.js` forwards `/api` to the ASP.NET server. Do not add template-only routes.

## Tests
- Vitest + jsdom with Angular `TestBed` (`ng test`). Use `describe`/`it`/`expect`.
- Provide `provideHttpClient()` and `provideHttpClientTesting()` when testing services or components that use `HttpClient`.
- Test components via inputs, outputs and the rendered DOM. Cover list load, delete, add, edit and validation behavior, not just "should create".
