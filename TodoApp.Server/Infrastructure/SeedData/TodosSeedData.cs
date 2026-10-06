using TodoApp.Server.Models;

namespace TodoApp.Server.Infrastructure.SeedData
{
    public static class TodosSeedData
    {
        // Seed data for Todos
        public static List<Todo> Todos = new List<Todo>
        {
            new Todo { Id = Guid.NewGuid(), Title = "Buy groceries", Description = "Milk, Bread, Eggs", DueDate = DateTimeOffset.Now.AddDays(1).ToUniversalTime() },
            new Todo { Id = Guid.NewGuid(), Title = "See the doctor", Description = "Doctor's visit", DueDate = DateTimeOffset.Now.AddDays(2).ToUniversalTime() },
            new Todo { Id = Guid.NewGuid(), Title = "Aunt's birthday", Description = "Buy a gift for Aunt's birthday", DueDate = DateTimeOffset.Now.AddDays(3).ToUniversalTime() }
        };
    }
}
