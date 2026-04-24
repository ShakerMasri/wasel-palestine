# Reporting Feature Load Tests

These k6 scripts cover only the Crowdsourced Reporting System feature in Wasel Palestine.

## What each test does

- `report-create-test.js` - write-heavy load for `POST /reports`
- `report-list-test.js` - read-heavy load for `GET /reports`
- `report-mixed-test.js` - mixed flow for create, get, and vote requests
- `report-spike-test.js` - sudden traffic spike against reporting endpoints
- `report-soak-test.js` - sustained load over time for basic soak testing

## Requirements

Install [k6](https://k6.io/docs/get-started/installation/).

Example installation commands:

- Windows: `choco install k6` or `scoop install k6`
- macOS: `brew install k6`
- Linux: follow the official k6 installation guide

## Environment variables

These scripts use environment variables so you can point them at your local backend and provide auth.

- `BASE_URL` - defaults to `http://localhost:3006`
- `JWT_TOKEN` - optional single bearer token
- `JWT_TOKENS` - optional comma-separated token pool for multi-user runs
- `AUTH_USERNAME` - optional login username (used if no token env var is provided)
- `AUTH_PASSWORD` - optional login password (used if no token env var is provided)
- `REPORT_ID` - optional fallback report ID for tests that need an existing report

Create-path tuning (to stay within backend anti-spam rule `max 3 creates / 5 minutes / user`):

- `CREATE_INTERVAL_SECONDS` (default `70`)
- `MIXED_CREATE_EVERY_N` (default `120`, only `VU 1` creates)
- `SPIKE_CREATE_EVERY_N` (default `180`, only `VU 1` creates)
- `SOAK_CREATE_EVERY_N` (default `150`, only `VU 1` creates)

Example:

```powershell
$env:BASE_URL = 'http://localhost:3006'
$env:JWT_TOKEN = 'YOUR_ACTUAL_JWT_TOKEN_HERE'
```

## Run the tests

```powershell
k6 run load-tests/report-create-test.js
k6 run load-tests/report-list-test.js
k6 run load-tests/report-mixed-test.js
k6 run load-tests/report-spike-test.js
k6 run load-tests/report-soak-test.js
```

If you want to override the URL inline:

```powershell
$env:BASE_URL='http://localhost:3006'; $env:JWT_TOKEN='YOUR_ACTUAL_JWT_TOKEN_HERE'; k6 run load-tests/report-mixed-test.js
```
