# Example: Query endpoint with query-string filters

Request: `GET api/todos?dueBefore=2026-12-31T00:00:00Z&dueAfter=2026-01-01T00:00:00Z`

```csharp
[HttpGet]
[ProducesResponseType<IEnumerable<Todo>>(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<ActionResult<IEnumerable<Todo>>> GetTodosAsync(
	[FromQuery] DateTimeOffset? dueBefore,
	[FromQuery] DateTimeOffset? dueAfter)
{
	var todos = await repository.GetAllAsync(
		dueBefore?.ToUniversalTime(),
		dueAfter?.ToUniversalTime());
	return Ok(todos); // 200 with [] when nothing matches
}
```

With many filters, group them:

```csharp
public class TodoQuery
{
	public DateTimeOffset? DueBefore { get; init; }
	public DateTimeOffset? DueAfter { get; init; }
}

[HttpGet]
public async Task<ActionResult<IEnumerable<Todo>>> GetTodosAsync([FromQuery] TodoQuery query) { ... }
```

Points shown: GET, optional camelCase query parameters, UTC normalization, empty result is 200, no filters in the path or body. Filtering requires a matching `ITodoRepository` change.
