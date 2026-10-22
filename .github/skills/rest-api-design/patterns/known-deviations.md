# Known Deviations in Existing Code

The skill's rules apply to new code only. Existing code may deviate from them. Do not copy these deviations into new endpoints. Fix them only when they are in scope.

- `Todo` is used directly as the request and response model. Use DTOs when the contract diverges from storage.
- The PUT route is `{id}` without `:guid`. GET and DELETE use or should use `{id:guid}`.
- Actions have no `CancellationToken`. Add one on new async actions.
- There are no `[ProducesResponseType]` attributes. Add them on new actions.
- `InMemoryTodoRepository` is a singleton over a shared static seed list and is not thread-safe. Do not extend this pattern.
