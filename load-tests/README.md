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

These scripts use environment variables so you can point them at your local backend and provide a JWT.

- `BASE_URL` - defaults to `http://localhost:3000`
- `JWT_TOKEN` - set this to a valid bearer token
- `REPORT_ID` - optional fallback report ID for tests that need an existing report

Example:

```powershell
$env:BASE_URL = 'http://localhost:3000'
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
$env:BASE_URL='http://localhost:3000'; $env:JWT_TOKEN='YOUR_ACTUAL_JWT_TOKEN_HERE'; k6 run load-tests/report-mixed-test.js
```
