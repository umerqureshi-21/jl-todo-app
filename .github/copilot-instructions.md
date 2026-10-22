# Copilot Instructions: jl-todo-app

## Overview
Full-stack Todo app. Solution: `TodoApp.slnx`.
- `TodoApp.Server`: ASP.NET Core Web API (.NET 10, controllers, nullable enabled).
- `TodoApp.Server.UnitTests`: xUnit + Moq.
- `todoapp.client`: Angular 22 standalone app (signals, Bootstrap 5, Vitest).

The server hosts the SPA (`UseDefaultFiles`, `MapStaticAssets`, `MapFallbackToFile`). In development, SpaProxy runs `npm start`, and the Angular dev server (port 65388) proxies `/api` to the server via `src/proxy.conf.js`.

## General Rules
- Follow existing patterns before introducing new ones.
- Use the skills in `.github/skills/` where they apply to the task.
- Keep `Program.cs` minimal (top-level statements, service registration + pipeline only).
- Every new server behavior needs a unit test. Every new client component or service needs a spec.
- Server and client validation rules must match; refer to validation rules defined in the story/existing code instead of specific fields or boundary values.
- Dates travel as ISO strings. The server stores `DateTimeOffset` in UTC.
- Do not leave template leftovers (e.g. `/weatherforecast` proxy entry, unused `title` signal, unused imports).

## Validation rules (single source of truth)
- Rules are defined by the user story; where the story is silent, by the validation attributes on the server models/DTOs. Do not infer or invent rules or limits.
- The client mirrors the server rules exactly (required, length, range, format, error behavior).
- Agents must reference this section instead of restating field rules. Any rule change is flagged as a server and client impact.

## Commands
- Server tests: `dotnet test TodoApp.slnx`
- Client tests: `npm test` (non-watch) in `todoapp.client`
- Client build: `npm run build` in `todoapp.client`

## Documentation Guidelines
- The backend or frontend agent must not write any documentation.
- Follow relevant instruction files in `.github/instructions/` and `.github/copilot-instructions.md`.
- Maintain an explicit tools list in the front matter. 

Path-specific rules are in `.github/instructions/`.
