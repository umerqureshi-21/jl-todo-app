# Example: Pragmatic action endpoint

**Use case:** mark a todo as complete, with rules or side effects beyond a field update.
**Why not a resource operation:** a plain PUT would force the client to resend the whole todo and would hide the transition rules.
**Idempotency:** idempotent. Completing an already completed todo returns 200 with no change.
**Partial failure:** not applicable (single resource).

```csharp
[HttpPost("{id:guid}/complete")]
[ProducesResponseType<Todo>(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<ActionResult<Todo>> CompleteTodoAsync(Guid id)
{
	var todo = await repository.CompleteAsync(id);
	return todo is null ? NotFound() : Ok(todo);
}
```

Bulk variant: `POST api/todos/bulk-delete` with body `{ "ids": ["..."] }` returns 200 with `{ "deleted": 3, "notFound": ["..."] }`. Define whether it is all-or-nothing or per-item before building it.

Points shown: the resource stays in the path, the action is a kebab-case last segment, POST for side effects, and the decision is recorded.
