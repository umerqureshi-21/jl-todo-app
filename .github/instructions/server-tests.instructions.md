---
description: xUnit and Moq conventions for server unit tests (naming, structure, assertions, coverage).
applyTo: "TodoApp.Server.UnitTests/**/*.cs"
---
# Server unit test conventions

- Framework: xUnit (`[Fact]`, `[Theory]`), Moq for mocks. `Xunit` is a global using.
- Mirror the production folder structure (`Controllers/TodoControllerTest.cs`). Class name `<Subject>Test`.
- Create the mock and system under test in the constructor. Keep them `private readonly`.
- Test names: `Method_Condition_ExpectedResult` (e.g. `GetTodoById_WhenDoesNotExist_ReturnsNotFound`).
- Use `// Arrange`, `// Act`, `// Assert` comments.
- Mock `ITodoRepository` and use `ReturnsAsync`. Use `(Todo?)null` for not-found cases.
- Assert on the concrete result type (`OkObjectResult`, `NotFoundResult`, `CreatedAtActionResult`, `NoContentResult`, `BadRequestResult`) and on the payload where relevant.
- Cover for every action: success, not found, and validation or mismatch paths (e.g. PUT with mismatched id returns 400).
- Verify repository interactions with `Verify` where they matter.
- Repository implementations get their own tests and must not share static state between tests.
