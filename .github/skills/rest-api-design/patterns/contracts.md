# Contracts

## Models
- Prefer separate request and response DTOs when the contract differs from the stored model. The current code uses `Todo` directly (see `known-deviations.md`).
- Keep nullable annotations accurate (nullable is enabled).
- Property names are camelCase on the wire (framework default).

## Identifiers
- Ids are `Guid`. The server generates them on create and ignores any client-sent id.
- On PUT, the body id must equal the route id, otherwise return 400.

## Dates
- Dates travel as ISO 8601 strings.
- The server normalizes with `ToUniversalTime()` and stores `DateTimeOffset` in UTC.

## Validation
- Do not invent rules or limits. Take them from the user story, otherwise from the validation attributes on the model.
- `[ApiController]` returns 400 automatically for model-state errors. Do not hand-roll these checks in actions.
- The client must mirror the server rules exactly. Any rule change is a server and client impact.

## OpenAPI
- Declare responses with `[ProducesResponseType]` so the generated OpenAPI document matches behavior.
