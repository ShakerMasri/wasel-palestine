# Testing Strategy

This document explains the Wasel Palestine testing approach, including automated tests, manual API validation, and load testing.

## Automated Testing

The repository uses **Jest** for unit and integration tests.

### Available commands

- `npm run test` — runs the full Jest test suite
- `npm run test:e2e` — runs end-to-end tests using the configuration in `test/jest-e2e.json`
- `npm run test:watch` — runs Jest in watch mode for local development
- `npm run test:cov` — generates test coverage reports

### Coverage Areas

- Authentication and JWT validation
- Checkpoints and incident management
- Crowdsourced reporting and voting
- Alert subscriptions
- External API integration endpoints
- Route estimation endpoints

## API Documentation and Manual Testing

The API specification is available in `docs/api/Wasel Palestine API.openapi.json`.

For manual validation:

- Import `docs/api/wasel-palestine-api.apidog.json` into Apidog or Postman
- Use the generated OpenAPI spec for Swagger or API explorer tools
- Verify authentication flow using JWT Bearer tokens for protected endpoints

## Load and Performance Testing

Load testing is performed with **k6**.

### Script location

- `load-tests/comprehensive-test.js`

### Example run command

```bash
k6 run load-tests/comprehensive-test.js
```

### What is validated

- Read-heavy operations such as incident, checkpoint, and report listing
- Write-heavy operations such as report creation and incident creation
- Mixed workflows covering both reads and writes
- Spike and sustained workload behavior over a 10-minute scenario

## Testing Artifacts

- OpenAPI file: `docs/api/Wasel Palestine API.openapi.json`
- Apidog collection: `docs/api/wasel-palestine-api.apidog.json`
- Load test scripts: `load-tests/`
- Postman collection: `postman/postman_collection.json`
- Postman environment: `postman/postman_environment.json`
