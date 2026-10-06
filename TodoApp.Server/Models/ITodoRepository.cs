namespace TodoApp.Server.Models
{
    public interface ITodoRepository
    {
        public Task<Todo> AddAsync(Todo todo);
        public Task<Todo?> UpdateAsync(Todo todo);
        public Task<bool> DeleteAsync(Guid id);
        public Task<Todo?> GetByIdAsync(Guid id);
        public Task<IEnumerable<Todo>> GetAllAsync();
    }
}
