using Microsoft.AspNetCore.Mvc;
using Moq;
using TodoApp.Server.Controllers;
using TodoApp.Server.Models;

namespace TodoApp.Server.UnitTests.Controllers
{
    public class TodoControllerTest
    {
        private readonly TodosController _todoController;
        private readonly Mock<ITodoRepository> _todoRepository;
        public TodoControllerTest()
        {
            _todoRepository = new Mock<ITodoRepository>();
            _todoController = new TodosController(_todoRepository.Object);
        }
        [Fact]
        public async Task GetTodoById_WhenExists_ReturnsTodo()
        {
            // Arrange
            var todo = new Todo
            {
                Id = Guid.NewGuid(),
                Title = "Test Todo",
                Description = "This is a test todo",
                DueDate = DateTimeOffset.Now.AddDays(1)
            };
            var id = todo.Id;
            _todoRepository.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(todo);

            //Act
            var result = await _todoController.GetTodoByIdAsync(id);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetTodoById_WhenDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var id = Guid.NewGuid();
            _todoRepository.Setup(x => x.GetByIdAsync(id)).ReturnsAsync((Todo?)null);

            //Act
            var result = await _todoController.GetTodoByIdAsync(id);

            //Assert
            Assert.NotNull(result);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetTodos_ReturnsAllTodos()
        {
            // Arrange
            var todos = new List<Todo>
            {
                new Todo { Id = Guid.NewGuid(), Title = "Todo 1", Description = "Description 1", DueDate = DateTimeOffset.Now.AddDays(1) },
                new Todo { Id = Guid.NewGuid(), Title = "Todo 2", Description = "Description 2", DueDate = DateTimeOffset.Now.AddDays(2) }
            };
            _todoRepository.Setup(x => x.GetAllAsync()).ReturnsAsync(todos);

            // Act
            var result = await _todoController.GetTodosAsync();

            // Assert
            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateTodo_ReturnsCreatedTodo()
        {
            // Arrange
            var todo = new Todo
            {
                Id = Guid.NewGuid(),
                Title = "New Todo",
                Description = "This is a new todo",
                DueDate = DateTimeOffset.Now.AddDays(1)
            };
            _todoRepository.Setup(x => x.AddAsync(todo)).ReturnsAsync(todo);

            // Act
            var result = await _todoController.CreateTodoAsync(todo);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }

        [Fact]
        public async Task UpdateTodo_WhenExists_ReturnsUpdatedTodo()
        {
            // Arrange
            var todo = new Todo
            {
                Id = Guid.NewGuid(),
                Title = "Updated Todo",
                Description = "This is an updated todo",
                DueDate = DateTimeOffset.Now.AddDays(1)
            };
            var id = todo.Id;
            _todoRepository.Setup(x => x.UpdateAsync(todo)).ReturnsAsync(todo);

            // Act
            var result = await _todoController.UpdateTodoAsync(id, todo);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task UpdateTodo_WhenDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var todo = new Todo
            {
                Id = Guid.NewGuid(),
                Title = "Updated Todo",
                Description = "This is an updated todo",
                DueDate = DateTimeOffset.Now.AddDays(1)
            };
            var id= todo.Id;
            _todoRepository.Setup(x => x.UpdateAsync(todo)).ReturnsAsync((Todo?)null);

            // Act
            var result = await _todoController.UpdateTodoAsync(id, todo);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task DeleteTodo_WhenExists_ReturnsNoContent()
        {
            // Arrange
            var id = Guid.NewGuid();
            _todoRepository.Setup(x => x.DeleteAsync(id)).ReturnsAsync(true);

            // Act
            var result = await _todoController.DeleteTodoAsync(id);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteTodo_WhenDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var id = Guid.NewGuid();
            _todoRepository.Setup(x => x.DeleteAsync(id)).ReturnsAsync(false);

            // Act
            var result = await _todoController.DeleteTodoAsync(id);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
    
