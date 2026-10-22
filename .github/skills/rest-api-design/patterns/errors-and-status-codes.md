# Errors and Status Codes

## Status code map
| Code | Use |
|---|---|
| 200 | Successful GET or PUT with a body |
| 201 | Successful create (include a `Location` via `CreatedAtAction`) |
| 204 | Successful delete or update with no body |
| 400 | Invalid input, or route/body id mismatch |
| 404 | Resource not found |
| 409 | State conflict (for example, a duplicate), only if the story defines one |
| 500 | Unhandled errors, through `UseExceptionHandler` |

## Rules
- All non-2xx bodies are `ProblemDetails` (`AddProblemDetails` is already registered).
- Return `NotFound()` and `BadRequest()` for expected cases. Do not throw for them.
- An empty list returns 200 with `[]`, never 404.
- Never expose stack traces or internal exception messages.
- Use the same error shape for every endpoint.
- Pragmatic endpoints use the same status codes and `ProblemDetails` shape as resource endpoints.

See `../examples/error-responses.md`.
