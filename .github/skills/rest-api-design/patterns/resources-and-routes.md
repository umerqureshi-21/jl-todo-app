# Resources and Routes

## Standard resource operations
| Operation | Verb | Route | Success |
|---|---|---|---|
| List / query | GET | `api/{resources}?{filters}` | 200 |
| Get | GET | `api/{resources}/{id:guid}` | 200 |
| Create | POST | `api/{resources}` | 201 + `CreatedAtAction` |
| Replace | PUT | `api/{resources}/{id:guid}` | 200 |
| Delete | DELETE | `api/{resources}/{id:guid}` | 204 |

## Rules
- Use `[Route("api/[controller]")]` on the controller. The controller name is the plural noun (`TodosController`).
- Action names end in `Async` (`GetTodoByIdAsync`).
- `CreatedAtAction` points at the get-by-id action name without the `Async` suffix.
- Use PATCH only when partial-update semantics are explicitly required. Otherwise use PUT.
- Use sub-resources (`api/todos/{id}/items`) only for true ownership. Otherwise use a top-level resource with a filter.
- For filtering, sorting and paging, see `query-endpoints.md`.
- For use cases that do not fit these operations, see `pragmatic-design.md`.
- Do not add API versioning unless the story requires it. If it does, use a URL segment (`api/v1/...`).

See `../examples/resource-crud.md`.
