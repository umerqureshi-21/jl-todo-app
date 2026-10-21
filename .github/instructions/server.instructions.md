---
description: ASP.NET Core server conventions for controllers, repositories, models, seed data and pipeline setup.
applyTo: "TodoApp.Server/**/*.cs"
---
# Server (ASP.NET Core, .NET 10) conventions

## Structure
- `Controllers/`: API controllers.
- `Models/`: domain models.
- `Infrastructure/Repositories/`: repository implementations.
- `Infrastructure/SeedData/`: seed data.
- New repository abstractions go next to `ITodoRepository`. Do not put infrastructure types in `Models`.
- Use block-scoped namespaces matching the folder path (`TodoApp.Server.<Folder>`), consistent with existing files.

## Architecture
- Controller -> `ITodoRepository` -> implementation. Controllers never touch storage directly.
- Register repositories in `Program.cs` (currently `AddSingleton<ITodoRepository, InMemoryTodoRepository>()`).
- Repository methods are async, return `Task`/`Task<T>`, and use the `Async` suffix.
  - `GetByIdAsync` and `UpdateAsync` return nullable (`Todo?`) when not found.
  - `DeleteAsync` returns `bool`.
- In-memory storage is a singleton, so it must be thread-safe. Do not expose internal collections. Return copies or snapshots.
- Seed data lives in static classes under `Infrastructure/SeedData`. Expose it as a read-only member, not a public mutable field.

## Controllers
- Use `[ApiController]`, `[Route("api/[controller]")]`, `ControllerBase` and a primary constructor for DI.
- Actions are async, named `<Verb><Entity>Async`, and return `ActionResult<T>` (or `ActionResult` when there is no body).
- Prefer `[HttpGet("{id:guid}")]` style routing with the `:guid` constraint on every id route.
- Status codes:
  - GET: 200 or 404.
  - POST: `CreatedAtAction` pointing at the get-by-id action. Verify the action name resolves at runtime.
  - PUT: 400 if route id != body id, 404 if missing, otherwise 200.
  - DELETE: 204 or 404.
- The server owns `Id` (generate on create) and normalizes `DueDate` to UTC.
- Rely on `[ApiController]` automatic model validation. Declare rules with data annotations (`[Required]`, `[MaxLength]`).
- Prefer request/response DTOs over binding the domain model directly when adding new endpoints.
- Accept and pass `CancellationToken` through async calls in new code.

## Pipeline and config
- Services: `AddControllers`, `AddOpenApi`, `AddProblemDetails`.
- Middleware: `UseExceptionHandler`, `UseHttpsRedirection`, `UseAuthorization`.
- `MapOpenApi` only in Development.
- Use `Nullable` annotations accurately. Do not mark a `[Required]` property nullable.
- Remove unused `using` directives.
