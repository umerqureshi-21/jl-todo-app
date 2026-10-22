using TodoApp.Server.Infrastructure.Repositories;
using TodoApp.Server.Models;

namespace TodoApp.Server.UnitTests.Infrastructure.Repositories
{
    public class InMemoryTodoRepositoryTest
    {
        private readonly InMemoryTodoRepository _repository = new();

        [Fact]
        public async Task GetAllAsync_AC7_WithDueBefore_ReturnsOnlyTodosDueBeforeOrAtBoundary()
        {
            // Arrange
            var boundary = new DateTimeOffset(2000, 1, 10, 12, 0, 0, TimeSpan.Zero);
            var before = await _repository.AddAsync(NewTodo("Before", boundary.AddMinutes(-1)));
            var atBoundary = await _repository.AddAsync(NewTodo("At", boundary));
            var after = await _repository.AddAsync(NewTodo("After", boundary.AddMinutes(1)));

            // Act
            var result = (await _repository.GetAllAsync(boundary)).ToList();

            // Assert
            Assert.Contains(result, t => t.Id == before.Id);
            Assert.Contains(result, t => t.Id == atBoundary.Id);
            Assert.DoesNotContain(result, t => t.Id == after.Id);
            Assert.All(result, t => Assert.True(t.DueDate <= boundary));
        }

        [Fact]
        public async Task GetAllAsync_AC8_WithNullDueBefore_ReturnsAllTodosIncludingNewlyAdded()
        {
            // Arrange
            var added = await _repository.AddAsync(NewTodo("Far future", new DateTimeOffset(2999, 12, 31, 0, 0, 0, TimeSpan.Zero)));
            var withoutDueDate = await _repository.AddAsync(new Todo { Id = Guid.NewGuid(), Title = "No due date", Description = string.Empty });

            // Act
            var result = (await _repository.GetAllAsync(null)).ToList();

            // Assert
            Assert.Contains(result, t => t.Id == added.Id);
            Assert.Contains(result, t => t.Id == withoutDueDate.Id);
        }

        [Fact]
        public async Task GetAllAsync_AC7_WithDueBeforeEarlierThanAllTodos_ReturnsEmpty()
        {
            // Arrange
            await _repository.AddAsync(NewTodo("Some todo", new DateTimeOffset(2000, 1, 10, 12, 0, 0, TimeSpan.Zero)));

            // Act
            var result = await _repository.GetAllAsync(DateTimeOffset.MinValue);

            // Assert
            Assert.Empty(result);
        }

        private static Todo NewTodo(string title, DateTimeOffset dueDate) => new()
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = string.Empty,
            DueDate = dueDate
        };
    }
}
