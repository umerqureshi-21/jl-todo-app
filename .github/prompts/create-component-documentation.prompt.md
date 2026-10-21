---
description: Generate Markdown documentation in the docs folder for an existing component. Usage - /create-component-documentation <ComponentName>
---

# Create Component Documentation

## What this command does
Creates a Markdown document in `docs/` describing one existing component of the codebase. The component name is passed as a parameter.

## Parameter
- `componentName` (required): the name of the component to document, for example `TodoController`, `TodoService`, `TodoItem`, or an Angular component/service such as `todo-form`.

## Steps
1. If no parameter was supplied, ask the user for the component name and stop until it is provided.
2. **Validate the parameter** before anything else:
   - Search the workspace (`TodoApp.Server`, `TodoApp.Server.UnitTests`, `todoapp.client/src`) for a matching component: a class, interface, or record by name on the server, or an Angular component, service, or model (by class name, selector, or file name, e.g. `todo-form.component.ts`) on the client.
   - Matching is case-insensitive and ignores suffixes such as `.component`, `.service`, and `.ts`.
   - Ignore `bin`, `obj`, `node_modules`, `dist`, and `docs` folders.
3. **If no match exists**:
   - Do NOT create or modify any file.
   - Reply only with: `Component "<name>" was not found. No documentation was generated.`
   - Optionally list up to 5 similar existing component names as suggestions.
   - Stop.
4. If multiple components match, ask the user which one to document, then continue.
5. Read the component's source files, its related files (models/DTOs, services, templates, styles), and its tests/specs.
6. Create `docs/<ComponentName>.md` (create `docs/` if missing; use kebab-case for Angular names, PascalCase for server names). If the file already exists, update it rather than duplicating.
7. Use this structure:
   - `# <ComponentName>`
   - **Overview**: purpose and responsibility, and whether it is server or client.
   - **Location**: relative paths of the source, test, and spec files.
   - **Public API**: endpoints, methods, inputs/outputs, or signals with signatures and short descriptions.
   - **Dependencies**: injected services, models, and other components used.
   - **Validation rules**: e.g. Title max 100, Description max 500, Title and DueDate required (only if relevant).
   - **Behavior and data flow**: how it works, including HTTP routes and status codes for the API.
   - **Testing**: the tests/specs that cover it and what they verify.
   - **Usage example**: a short snippet taken from or consistent with the real code.
8. Summarize the file created and its path.

## Rules
- Document only what exists in the code; do not invent behavior.
- Never generate documentation for a name that does not resolve to an existing component.
- Write only to `docs/`; do not modify source code or instruction files.
- Keep the document concise and scannable, with accurate names and paths.
