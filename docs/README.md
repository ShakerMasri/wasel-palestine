# Wasel Palestine Documentation

This folder contains the project documentation required for evaluation and future maintenance.

## Included Documentation

- `architecture.md` - System overview, visual architecture diagram, component responsibilities, and API design rationale.
- `database.md` - Relational database model, ERD diagram, entity relationships, and schema rationale.
- `testing.md` - Testing strategy, execution commands, and test artifact references.
- `performance.md` - k6 load test summary, metrics, observations, and recommendations.
- `api/Wasel Palestine API.openapi.json` - OpenAPI 3 specification for the backend API.
- `api/wasel-palestine-api.apidog.json` - Apidog/Postman-compatible API collection for manual testing.

## How to Use These Docs

1. Open `docs/architecture.md` for the system overview and API design rationale.
2. Open `docs/database.md` for the entity model and relationships.
3. Open `docs/testing.md` for the testing approach and commands.
4. Open `docs/performance.md` for the latest load testing results.
5. Use the OpenAPI JSON file in `docs/api/` with tools like Swagger, Apidog, or Postman.

## Important Notes

- The API is versioned under `/api/v1/`.
- Authentication is implemented with JWT and bearer tokens.
- External integrations include weather and routing services.
- Load testing uses the `load-tests/` directory.
