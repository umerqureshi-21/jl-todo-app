# Example: Error responses

All non-2xx bodies are `ProblemDetails`.

```csharp
// 404: expected case, return, do not throw
if (todo is null) return NotFound();

// 400: route and body id mismatch
if (id != todo.Id) return BadRequest();

// 400 with detail
return Problem(
	title: "Invalid filter",
	detail: "dueAfter must be earlier than dueBefore.",
	statusCode: StatusCodes.Status400BadRequest);

// 409: only when the story defines a conflict
return Problem(
	title: "Conflict",
	detail: "The todo was modified.",
	statusCode: StatusCodes.Status409Conflict);
```

Model-state errors return 400 automatically through `[ApiController]`. Unhandled exceptions become 500 `ProblemDetails` through `UseExceptionHandler`. Never expose stack traces.
