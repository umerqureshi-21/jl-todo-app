---
name: rest-api-design
description: REST API design rules for TodoApp.Server (ASP.NET Core controllers). Best-practice REST that mixes resource-based design with pragmatic, use-case-driven endpoints. Covers resource modeling, routes, verbs, query endpoints, status codes, contracts and error responses. WHEN: design or review an endpoint, add a route, add filtering or search, choose a status code, change an API contract, define an error response, decide between a resource endpoint and an action endpoint. DO NOT USE FOR: client code, tests, persistence, or UI.
---

# REST API Design

Design rules for HTTP endpoints in `TodoApp.Server`. This file is the entry point. Load only the `patterns/` and `examples/` files the task needs.

## Design approach
Follow REST best practices with a mix of two styles:
1. **Resource-based (default).** Model the domain as resources and use standard verbs and status codes.
2. **Pragmatic (by exception).** Use a use-case-driven endpoint when forcing it into CRUD would make the API awkward, chatty, or unclear. Examples are bulk operations and state transitions.

Decide in this order: resource first, pragmatic only when the resource model clearly does not fit. Record the reason for each pragmatic endpoint.

## Core rules (always apply)
1. Resources are plural nouns under `api/` (`api/todos`). No verbs in resource URLs.
2. Use the HTTP verb for the action: GET read, POST create, PUT replace, DELETE remove.
3. **Query endpoints use GET, and filter parameters are passed as query strings** (`GET api/todos?dueBefore=...`). Never in the path or a request body.
4. Identifiers use a `{id:guid}` route constraint.
5. Use `[ApiController]`, and return `ActionResult<T>` or `ActionResult`.
6. Non-2xx responses use RFC 7807 `ProblemDetails`.
7. The server generates ids. Dates are ISO 8601 strings and are stored in UTC.
8. Do not restate validation rules. They live in the story, and otherwise in the model attributes (see `.github/copilot-instructions.md`).
9. GET is safe and idempotent. PUT and DELETE are idempotent. POST is not.
10. Follow the existing `TodosController` pattern before introducing a new one.

## Scope
These rules apply to new code only. Existing code may deviate (see `patterns/known-deviations.md`). Do not copy those deviations into new endpoints, and fix existing ones only when they are in scope.

## Progressive disclosure

### Patterns (rules). Read when deciding or reviewing
| If the task involves... | Read |
|---|---|
| New resource, route shape, verb choice, sub-resources, versioning | `patterns/resources-and-routes.md` |
| Filtering, sorting, paging, search | `patterns/query-endpoints.md` |
| Action endpoint, bulk operation, state transition, aggregated read | `patterns/pragmatic-design.md` |
| Request/response models, DTOs, JSON shape, dates, ids | `patterns/contracts.md` |
| Status codes, 400/404/409, `ProblemDetails` | `patterns/errors-and-status-codes.md` |
| Reviewing or extending existing endpoints | `patterns/known-deviations.md` |

### Examples (code). Read when implementing
| If you need a sample of... | Read |
|---|---|
| Standard CRUD controller actions | `examples/resource-crud.md` |
| A filtered GET with query-string parameters | `examples/query-endpoint.md` |
| A justified action endpoint | `examples/pragmatic-action.md` |
| Error responses and status codes in actions | `examples/error-responses.md` |

## Workflow
1. Inspect the existing controller (`TodosController`) for the current pattern.
2. Try to express the use case as a resource operation. If it fits, stop there.
3. If it does not fit, apply `patterns/pragmatic-design.md` and note the justification.
4. For query endpoints, define each filter as a named query-string parameter.
5. Output the endpoint design: verb, route, query parameters, request, response, status codes, and the style used.
6. Flag any change to a validation rule as a server and client impact.

## Output checklist
- [ ] Style chosen (resource or pragmatic), with a reason if pragmatic
- [ ] Route and verb are correct
- [ ] Filters are query-string parameters on a GET
- [ ] Status codes are complete for success and failure
- [ ] Contract is explicit (request and response shapes)
- [ ] No deviation copied from `patterns/known-deviations.md`
