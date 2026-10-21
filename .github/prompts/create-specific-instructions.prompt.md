---
description: Create path-specific Copilot instruction files in .github/instructions/ for a given area of the codebase.
---

# Create Specific Instructions

## What this command does
Creates one or more path-specific instruction files in `.github/instructions/`. Each file contains rules that apply only to a defined set of files, selected with an `applyTo` glob in the YAML front matter.

## Purpose
Use this command to capture conventions for one area of the codebase, for example:
- `TodoApp.Server/**` (controllers, services, models)
- `TodoApp.Server.UnitTests/**` (xUnit + Moq test conventions)
- `todoapp.client/src/**` (Angular components, services, specs)

Path-specific instructions keep guidance targeted. Copilot applies them only when working on matching files.

## Global instructions
This command is **not** for global instructions. If global (repository-wide) instructions need to be created or updated in `.github/copilot-instructions.md`, use the `/generateInstructions` command instead.

## Steps
1. Ask the user which area, technology, or path the instructions should cover, if it isn't specified.
2. Inspect the existing code in that area to find the real patterns, naming, structure, and tooling in use.
3. Read `.github/copilot-instructions.md` and the existing files in `.github/instructions/`. Don't duplicate or contradict them.
4. Create `.github/instructions/<area>.instructions.md` with front matter in exactly this format:
   - `applyTo` is a single double-quoted string.
   - Multiple patterns are separated by commas, with no spaces and no YAML list.
   - Example: `applyTo: "todoapp.client/**/*form*.ts,todoapp.client/**/*form*.html"`
5. Write concise, actionable rules as bullet points. Cover:
   - Structure and naming conventions
   - Patterns to follow and anti-patterns to avoid
   - Validation, testing, and error-handling expectations
   - Rules that must stay consistent between server and client
6. Keep each file focused on a single area and short enough to scan quickly.
7. Summarize the files created and the `applyTo` pattern for each.

## Rules
- Base rules on the existing codebase, not on generic best practices.
- Don't repeat rules already in the global instructions.
- Write `applyTo` on one line as a comma-separated, double-quoted string. Don't use arrays or multiple `applyTo` keys.
- Use specific `applyTo` globs.
- Don't create or modify global instructions. Direct the user to `/generateInstructions` for that.
