# Pragmatic, Use-Case-Driven Design

Use this only when a plain resource operation does not express the use case well. The resource-based design in `resources-and-routes.md` stays the default.

## When pragmatic is justified
| Situation | Preferred approach |
|---|---|
| State transition (complete, reopen) | First try modeling it as a field update (`PUT` or `PATCH`). If the transition has rules or side effects, use `POST api/todos/{id:guid}/complete` |
| Bulk operation (delete all completed, mark many done) | `POST api/todos/bulk-...` or a collection-level action, with an explicit request body listing the targets |
| Aggregated or query-shaped read (counts, summaries) | `GET api/todos/summary` or `GET api/todos/stats`, read-only and cacheable, with any filters as query-string parameters |
| Operation spanning several resources | A single use-case endpoint, to avoid chatty calls and partial failure on the client |

## Rules
- Resource first: confirm the use case cannot be a standard verb on a resource before choosing an action endpoint.
- Query and read use cases are never pragmatic exceptions. They stay GET with query-string filters (see `query-endpoints.md`). Do not use `POST .../search`.
- Name action endpoints with a verb or noun phrase as the last path segment, in kebab-case. Keep the resource in the path (`api/todos/{id:guid}/complete`).
- Use POST for actions with side effects. Use GET only for safe reads.
- Keep the same contract rules: the same `ProblemDetails` errors, the same status codes, the same date and id handling.
- Make actions idempotent where possible, and document it when they are not.
- Return the updated resource (200) or 204 for actions on a single resource. For bulk actions, return a result summary (counts, failed ids).
- Define partial-failure behavior for bulk operations up front (all-or-nothing, or per-item results).
- Do not tunnel everything through one generic endpoint (`POST api/execute`). Each use case gets its own explicit route and contract.

## Record the decision
For every pragmatic endpoint, state in the design output:
- The use case
- Why a resource operation does not fit
- The idempotency and partial-failure behavior

See `../examples/pragmatic-action.md`.
