# Example: Resource CRUD (matches the existing `TodosController` style)

```csharp
[Route("api/[controller]")]
[ApiController]
public class TodosController(ITodoRepository repository) : ControllerBase
{
	[HttpGet("{id:guid}")]
	[ProducesResponseType<Todo>(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<ActionResult<Todo>> GetTodoByIdAsync(Guid id)
	{
		var todo = await repository.GetByIdAsync(id);
		return todo is null ? NotFound() : Ok(todo);
	}

	[HttpPost]
	[ProducesResponseType<Todo>(StatusCodes.Status201Created)]
	public async Task<ActionResult<Todo>> CreateTodoAsync(Todo todo)
	{
		todo.Id = Guid.NewGuid();                       // server generates ids
		todo.DueDate = todo.DueDate?.ToUniversalTime(); // store UTC
		var created = await repository.AddAsync(todo);
		return CreatedAtAction("GetTodoById", new { id = created.Id }, created);
	}

	[HttpPut("{id:guid}")]
	[ProducesResponseType<Todo>(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<ActionResult<Todo>> UpdateTodoAsync(Guid id, Todo todo)
	{
		if (id != todo.Id) return BadRequest();
		todo.DueDate = todo.DueDate?.ToUniversalTime();
		var updated = await repository.UpdateAsync(todo);
		return updated is null ? NotFound() : Ok(updated);
	}

	[HttpDelete("{id:guid}")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<ActionResult> DeleteTodoAsync(Guid id)
		=> await repository.DeleteAsync(id) ? NoContent() : NotFound();
}
```

Points shown: `:guid` constraint, `ProducesResponseType`, 201 via `CreatedAtAction`, id mismatch returns 400.
