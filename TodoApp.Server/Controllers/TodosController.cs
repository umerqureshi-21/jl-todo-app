using Microsoft.AspNetCore.Mvc;
using TodoApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodosController(ITodoRepository repository) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> GetTodosAsync()
        {
            var todos = await repository.GetAllAsync();
            return Ok(todos);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<ActionResult<Todo>> GetTodoByIdAsync(Guid id)
        {
            var todo = await repository.GetByIdAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            return Ok(todo);
        }

        [HttpPost]
        public async Task<ActionResult<Todo>> CreateTodoAsync(Todo todo)
        {
            todo.Id = Guid.NewGuid();
            todo.DueDate = todo.DueDate?.ToUniversalTime();
            var createdTodo = await repository.AddAsync(todo);
            return CreatedAtAction("GetTodoById", new { id = createdTodo.Id }, createdTodo);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<Todo>> UpdateTodoAsync(Guid id, Todo todo)
        {
            if (id != todo.Id)
            {
                return BadRequest();
            }
            todo.DueDate = todo.DueDate?.ToUniversalTime();
            var updatedTodo = await repository.UpdateAsync(todo);
            if (updatedTodo == null)
            {
                return NotFound();
            }
            return Ok(updatedTodo);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> DeleteTodoAsync(Guid id)
        {
            var deleted = await repository.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
