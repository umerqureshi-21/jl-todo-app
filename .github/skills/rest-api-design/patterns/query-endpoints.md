# Query Endpoints (filtering, sorting, paging)

- Query endpoints are GET requests. **Filter parameters are always query-string parameters.**
- Never put filters in the path (`api/todos/overdue`), and never in a request body.
- Bind with `[FromQuery]`. Use individual parameters for a few filters, or a query-parameter class with `[FromQuery]` when there are many.
- Name parameters in camelCase after the field they filter (`dueBefore`, `dueAfter`).
- Make every filter optional. Omitting all filters returns the full collection.
- Sorting and paging are also query parameters (`sort`, `order`, `page`, `pageSize`). Add them only when the story requires them.
- Date filters use ISO 8601 strings. The server normalizes them to UTC.
- Return 200 with `[]` when nothing matches. Return 400 (`ProblemDetails`) for malformed or invalid filter values.
- Validation of filter values follows the same rules as other input. Do not invent limits.
- Do not use `POST .../search` for queries.

See `../examples/query-endpoint.md`.
