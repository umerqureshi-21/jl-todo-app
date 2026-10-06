using TodoApp.Server.Infrastructure.SeedData;
using TodoApp.Server.Models;

namespace TodoApp.Server.Infrastructure.Repositories
{
    public class InMemoryTodoRepository : ITodoRepository
    {
        private readonly List<Todo> _todos = TodosSeedData.Todos;
        public Task<Todo> AddAsync(Todo todo)
        {
            _todos.Add(todo);
            return Task.FromResult(todo);
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            var existingTodo = _todos.FirstOrDefault(t => t.Id == id);
            if (existingTodo != null)
            {
                _todos.Remove(existingTodo);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public Task<IEnumerable<Todo>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Todo>>(_todos);
        }

        public Task<Todo?> GetByIdAsync(Guid id)
        {
            return Task.FromResult(_todos.FirstOrDefault(t => t.Id == id));

        }

        public Task<Todo?> UpdateAsync(Todo todo)
        {
            var existingTodo = _todos.FirstOrDefault(t => t.Id == todo.Id);
            if (existingTodo != null)
            {
                existingTodo.Title = todo.Title;
                existingTodo.Description = todo.Description;
                existingTodo.DueDate = todo.DueDate;
            }
            return Task.FromResult(existingTodo);
        }
    }
}
