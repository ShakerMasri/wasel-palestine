# Wasel Palestine — Route Mobility & External API Integration

## Overview

This document explains the updated implementation for **Feature 3 — Route Estimation & Mobility Intelligence** and the related external API, environment configuration, caching, timeout, rate limiting, and JWT security changes.

The update combines two important parts of the backend work:

1. **Route Mobility Feature**
   - Provides route estimation between two geographic points.
   - Supports route-affecting constraints such as avoiding checkpoints and avoiding specific areas.
   - Adds explanatory metadata showing how the estimate was calculated.

2. **External API Integration Update**
   - Adds the missing required routing/geolocation external API.
   - Keeps the existing weather API integration.
   - Moves secrets and environment-specific values out of source code and into `.env`.
   - Adds caching, timeouts, and rate limiting for safer external API usage.

This aligns with the project requirement that the backend must integrate with at least two external APIs, including:

- a routing or geolocation service
- a contextual data provider such as a weather API

---

## What Was Added

### 1. Route Estimation Endpoint

The route mobility module exposes a dedicated route estimation endpoint:

```http
POST /api/v1/route-mobility/estimate
```

The endpoint accepts start and end coordinates, route mode, checkpoint avoidance, optional external routing, and avoided areas.

Supported route modes:

```text
fastest
balanced
safest
```

---

### 2. OpenRouteService Integration

OpenRouteService was added as the external routing/geolocation provider.

It is used to estimate a driving route between two coordinates and return:

- distance in kilometers
- duration in minutes
- raw distance in meters
- raw duration in seconds
- cache metadata

The route mobility feature uses OpenRouteService as the base route estimate when `useExternalRouting` is enabled.

If OpenRouteService fails, times out, or the API key is missing, the system falls back to the local heuristic route estimator instead of breaking the request.

---

### 3. OpenWeatherMap Integration Cleanup

The existing weather integration was kept, but the hardcoded API key was removed.

The weather API now reads the key from `.env` and returns:

- provider
- city
- temperature
- weather description
- humidity
- cache metadata

Weather endpoint:

```http
GET /api/v1/weather/:city
```

Example:

```http
GET /api/v1/weather/Nablus
```

---

### 4. Environment-Based Configuration

The project now uses `.env` for secrets and environment-specific values.

This removes hardcoded values from source code such as:

- database credentials
- JWT secret
- OpenWeatherMap API key
- OpenRouteService API key
- external API timeout values
- cache TTL values
- rate limit values

---

### 5. Caching, Timeouts, and Rate Limiting

External API integrations now include better reliability controls:

- **Caching** reduces repeated external API calls.
- **Timeouts** prevent the backend from waiting too long on external services.
- **Rate limiting** protects the backend from excessive request traffic.

These controls are important because external APIs may be slow, unavailable, or limited by usage quotas.

---

### 6. JWT Secret Cleanup

JWT configuration was moved from hardcoded source files to `.env`.

Updated files:

```text
src/auth/auth.module.ts
src/auth/jwt.strategy.ts
src/auth/auth.guard.ts
```

The old `src/auth/constants.ts` file is no longer needed after all `jwtConstants` imports are removed.

---

## Architecture Summary

The route mobility feature works as a computation layer. It does not need to persist route estimates in the database.

It reads existing project data from:

- checkpoints
- incidents
- authentication/JWT context when protected routes are used

The route estimate is calculated using this flow:

1. Read start and end coordinates from the request.
2. Try OpenRouteService if `useExternalRouting` is true.
3. Use the external route distance and duration if the external API succeeds.
4. Fall back to local heuristic calculation if the external API fails.
5. Apply Wasel-specific intelligence:
   - checkpoint penalties
   - verified incident penalties
   - avoided area penalties
   - route mode adjustments
6. Return the final estimate with explanatory metadata.

---

## Route Estimation Logic

The local heuristic route calculation is still kept as a fallback.

It uses:

- Haversine formula for direct geographic distance
- route mode multipliers
- average speed assumptions
- checkpoint proximity checks
- verified incident checks
- avoided area checks

This is useful because the course requirement allows route estimation to rely on heuristics and does not require exact road-graph accuracy.

---

## Main Endpoint

### Estimate Route

```http
POST /api/v1/route-mobility/estimate
```

### Request Body

```json
{
  "startLatitude": 32.2211,
  "startLongitude": 35.2544,
  "endLatitude": 31.9522,
  "endLongitude": 35.2332,
  "mode": "balanced",
  "avoidCheckpoints": true,
  "useExternalRouting": true,
  "avoidAreas": [
    {
      "name": "Test blocked area",
      "minLatitude": 32.0,
      "maxLatitude": 32.3,
      "minLongitude": 35.2,
      "maxLongitude": 35.3
    }
  ]
}
```

### Important Request Fields

| Field                | Type    | Purpose                                                     |
| -------------------- | ------- | ----------------------------------------------------------- |
| `startLatitude`      | number  | Starting latitude                                           |
| `startLongitude`     | number  | Starting longitude                                          |
| `endLatitude`        | number  | Destination latitude                                        |
| `endLongitude`       | number  | Destination longitude                                       |
| `mode`               | string  | `fastest`, `balanced`, or `safest`                          |
| `avoidCheckpoints`   | boolean | Adds stronger penalties when checkpoints are near the route |
| `useExternalRouting` | boolean | Uses OpenRouteService first when true                       |
| `avoidAreas`         | array   | Rectangular areas that should affect route estimation       |

---

## Example Response

```json
{
  "start": {
    "latitude": 32.2211,
    "longitude": 35.2544
  },
  "end": {
    "latitude": 31.9522,
    "longitude": 35.2332
  },
  "estimatedDistanceKm": 55.4,
  "estimatedDurationMinutes": 70.2,
  "metadata": {
    "mode": "balanced",
    "routingProvider": "openrouteservice",
    "useExternalRouting": true,
    "directDistanceKm": 30.74,
    "baseRoadFactor": 1.25,
    "averageSpeedKmh": 45,
    "avoidCheckpoints": true,
    "avoidedAreasCount": 1,
    "nearbyCheckpointsCount": 2,
    "nearbyIncidentsCount": 1,
    "externalRoute": {
      "provider": "openrouteservice",
      "distanceKm": 50.12,
      "durationMinutes": 65.3,
      "cached": false
    },
    "factors": [
      {
        "type": "checkpoints",
        "message": "Route adjusted to avoid 2 nearby checkpoint(s).",
        "impactDistanceKm": 3.84,
        "impactDurationMinutes": 12
      },
      {
        "type": "avoid_areas",
        "message": "Route detoured to avoid 1 requested area(s).",
        "impactDistanceKm": 4.2,
        "impactDurationMinutes": 8
      }
    ],
    "summary": "Estimated route in balanced mode using openrouteservice: 55.4 km, 70.2 minutes. Factors considered: 2 checkpoint(s), 1 verified incident(s), 1 avoided area(s)."
  }
}
```

### How to Read the Response

If the response contains:

```json
"routingProvider": "openrouteservice"
```

then the external routing API worked.

If the response contains:

```json
"routingProvider": "local_heuristic"
```

then the system used the fallback heuristic estimator.

---

## External API Test Endpoints

### Weather

```http
GET /api/v1/weather/:city
```

Example:

```http
GET /api/v1/weather/Nablus
```

Alternative endpoint:

```http
GET /api/v1/external-api/weather/:city
```

---

### Direct External Routing Test

```http
POST /api/v1/external-api/routing/estimate
```

This endpoint directly tests OpenRouteService without the full Wasel route intelligence layer.

Example body:

```json
{
  "startLatitude": 32.2211,
  "startLongitude": 35.2544,
  "endLatitude": 31.9522,
  "endLongitude": 35.2332,
  "mode": "balanced",
  "avoidCheckpoints": true,
  "useExternalRouting": true,
  "avoidAreas": []
}
```

Expected provider:

```json
"provider": "openrouteservice"
```

---

## Environment Variables

Create a local `.env` file in the project root, beside `package.json`.

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=admin_wasel
DB_PASSWORD=wasel1234
DB_NAME=wasel_palestine
DB_SYNC=true

JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=1h

OPENWEATHER_API_KEY=your_openweather_key_here
OPENROUTESERVICE_API_KEY=your_openrouteservice_key_here

EXTERNAL_API_TIMEOUT_MS=5000
WEATHER_CACHE_TTL_MS=1800000
ROUTING_CACHE_TTL_MS=1800000

THROTTLE_TTL_MS=60000
THROTTLE_LIMIT=60
```

### `.env.example`

Commit `.env.example` to the repository, but do not include real secrets.

```env
PORT=

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_SYNC=

JWT_SECRET=
JWT_EXPIRES_IN=

OPENWEATHER_API_KEY=
OPENROUTESERVICE_API_KEY=

EXTERNAL_API_TIMEOUT_MS=
WEATHER_CACHE_TTL_MS=
ROUTING_CACHE_TTL_MS=

THROTTLE_TTL_MS=
THROTTLE_LIMIT=
```

### Security Notes

- Do not commit `.env`.
- Commit `.env.example`.
- Regenerate any API key that was previously hardcoded or exposed.
- Keep JWT secrets out of source code.
- Make sure `.gitignore` includes `.env`.

Recommended `.gitignore` entries:

```gitignore
.env
.env.local
.env.*.local
```

---

## Dependencies Added

Install the new dependencies:

```bash
npm i @nestjs/config @nestjs/throttler
```

Purpose:

- `@nestjs/config` loads environment variables from `.env`.
- `@nestjs/throttler` enables API rate limiting.

---

## Main Files Changed

```text
.env.example
.gitignore
package.json
package-lock.json
src/app.module.ts
src/external-api/external-api.module.ts
src/external-api/external-api.service.ts
src/external-api/external-api.controller.ts
src/external-api/external-api.service.spec.ts
src/route-mobility/route-mobility.module.ts
src/route-mobility/route-mobility.service.ts
src/route-mobility/dto/estimate-route.dto.ts
src/auth/auth.module.ts
src/auth/jwt.strategy.ts
src/auth/auth.guard.ts
```

Optional deletion:

```text
src/auth/constants.ts
```

Before deleting `constants.ts`, check that nothing imports `jwtConstants` anymore:

```bash
grep -R "jwtConstants" src
```

On Windows Git Bash, the same command should work. If using Command Prompt, search manually or use your editor search.

---

## Module-Level Changes

### `src/app.module.ts`

Updated to:

- load `.env` globally using `ConfigModule.forRoot()`
- configure PostgreSQL from environment variables
- configure global rate limiting using `ThrottlerModule`
- keep all existing modules connected

---

### `src/external-api/external-api.module.ts`

Updated to:

- register `HttpModule` with timeout support
- register `CacheModule` for external API response caching
- import `ConfigModule`
- export `ExternalApiService` for use in route mobility

---

### `src/external-api/external-api.service.ts`

Updated to:

- call OpenWeatherMap for weather data
- call OpenRouteService for driving route data
- read API keys from `.env`
- cache weather and routing responses
- apply request timeouts
- return clear metadata about provider and cache status
- return `null` for routing failures when fallback is allowed

---

### `src/external-api/external-api.controller.ts`

Updated to expose:

```http
GET /api/v1/weather/:city
GET /api/v1/external-api/weather/:city
POST /api/v1/external-api/routing/estimate
```

---

### `src/route-mobility/route-mobility.module.ts`

Updated to import `ExternalApiModule`, allowing `RouteMobilityService` to use external routing.

---

### `src/route-mobility/dto/estimate-route.dto.ts`

Added:

```ts
useExternalRouting?: boolean = true;
```

This controls whether the service should try OpenRouteService first or use only local heuristics.

---

### `src/route-mobility/route-mobility.service.ts`

Updated to:

- use OpenRouteService as the base route estimate when enabled
- fall back to local heuristic estimation when needed
- apply route mode adjustments
- apply checkpoint penalties
- apply verified incident penalties
- apply avoided area penalties
- return detailed explanatory metadata

---

### Auth Files

Updated files:

```text
src/auth/auth.module.ts
src/auth/jwt.strategy.ts
src/auth/auth.guard.ts
```

These files now read JWT configuration from `.env` instead of `src/auth/constants.ts`.

---

## How to Run

### 1. Install dependencies

```bash
npm install
npm i @nestjs/config @nestjs/throttler
```

### 2. Start the database

```bash
docker compose up -d
```

If your project uses the old Docker Compose command:

```bash
docker-compose up -d
```

### 3. Start the backend

```bash
npm run start:dev
```

Base API URL:

```text
http://localhost:3000/api/v1
```

---

## Testing Checklist

### 1. Build the Project

```bash
npm run build
```

Expected result: no TypeScript errors.

---

### 2. Test Weather API

```http
GET http://localhost:3000/api/v1/weather/Nablus
```

Call it twice. The second response should show:

```json
"cached": true
```

---

### 3. Test Direct External Routing

```http
POST http://localhost:3000/api/v1/external-api/routing/estimate
```

Body:

```json
{
  "startLatitude": 32.2211,
  "startLongitude": 35.2544,
  "endLatitude": 31.9522,
  "endLongitude": 35.2332,
  "mode": "balanced",
  "avoidCheckpoints": true,
  "useExternalRouting": true,
  "avoidAreas": []
}
```

Expected field:

```json
"provider": "openrouteservice"
```

---

### 4. Test Full Route Mobility Endpoint

```http
POST http://localhost:3000/api/v1/route-mobility/estimate
```

Body:

```json
{
  "startLatitude": 32.2211,
  "startLongitude": 35.2544,
  "endLatitude": 31.9522,
  "endLongitude": 35.2332,
  "mode": "balanced",
  "avoidCheckpoints": true,
  "useExternalRouting": true,
  "avoidAreas": []
}
```

Expected metadata:

```json
"routingProvider": "openrouteservice"
```

---

### 5. Test Local Fallback

```http
POST http://localhost:3000/api/v1/route-mobility/estimate
```

Body:

```json
{
  "startLatitude": 32.2211,
  "startLongitude": 35.2544,
  "endLatitude": 31.9522,
  "endLongitude": 35.2332,
  "mode": "balanced",
  "avoidCheckpoints": true,
  "useExternalRouting": false,
  "avoidAreas": []
}
```

Expected metadata:

```json
"routingProvider": "local_heuristic"
```

---

### 6. Test Avoid Areas

```http
POST http://localhost:3000/api/v1/route-mobility/estimate
```

Body:

```json
{
  "startLatitude": 32.2211,
  "startLongitude": 35.2544,
  "endLatitude": 31.9522,
  "endLongitude": 35.2332,
  "mode": "safest",
  "avoidCheckpoints": true,
  "useExternalRouting": true,
  "avoidAreas": [
    {
      "name": "Test blocked area",
      "minLatitude": 32.0,
      "maxLatitude": 32.3,
      "minLongitude": 35.2,
      "maxLongitude": 35.3
    }
  ]
}
```

Expected factor:

```json
{
  "type": "avoid_areas",
  "message": "Route detoured to avoid 1 requested area(s)."
}
```

---

### 7. Test JWT Flow

Register or login to get an access token.

```http
POST /api/v1/auth/login
```

Use the token for protected routes:

```http
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### 8. Test Rate Limiting

Temporarily lower the limit in `.env`:

```env
THROTTLE_TTL_MS=60000
THROTTLE_LIMIT=3
```

Restart the server and call the same endpoint more than 3 times quickly.

Expected result:

```http
429 Too Many Requests
```

After testing, restore:

```env
THROTTLE_LIMIT=60
```

---

## Current Limitations

- Route estimation is still partially heuristic-based.
- OpenRouteService provides the base distance and duration, but Wasel-specific conditions are applied as approximate penalties.
- Avoided areas are represented as rectangular bounding boxes, not full polygon geometry.
- Checkpoint and incident influence depends on stored coordinates and verified incident data.
- Alternative routes are not returned yet.
- Weather is available through the external API module but is not yet applied directly to route penalties.

---

## Future Improvements

Possible upgrades:

- apply weather data directly to route metadata and penalties
- support polygon-based avoid areas instead of only rectangles
- return multiple alternative routes
- store route estimation logs for analytics
- add dedicated unit tests for routing edge cases
- add e2e tests for route mobility and external APIs
- include final examples in ApiDog/Postman collections
- add k6 scenarios for route estimation and external API endpoints

---

## GitHub Workflow Recommendation

Because the previous `route-mobility` branch was already merged into `main`, create a new branch for this external API and configuration update.

### 1. Go to main

```bash
git checkout main
```

### 2. Pull latest changes

```bash
git pull origin main
```

### 3. Create a new branch

```bash
git checkout -b feature/external-api-routing-config
```

### 4. Check changed files

```bash
git status
```

Make sure `.env` is not staged.

If `.env` appears staged:

```bash
git restore --staged .env
```

### 5. Add changes

```bash
git add .
```

If you want to be extra careful, add files manually instead:

```bash
git add .gitignore .env.example package.json package-lock.json src README.md
```

Add this documentation file too if you place it in the project root:

```bash
git add ROUTE_MOBILITY_EXTERNAL_APIS_README.md
```

### 6. Commit

Recommended commit message:

```bash
git commit -m "feat: add routing external API and env-based config"
```

Suggested commit description:

```text
- add OpenRouteService integration for route estimation
- keep OpenWeather integration and move API keys to environment variables
- add .env.example for required configuration values
- configure database and JWT secrets using ConfigModule
- add caching and timeout handling for external API calls
- add global rate limiting with Nest throttler
- connect route mobility estimation with external routing fallback
- update JWT strategy and auth guard to use env-based secrets
```

### 7. Push the branch

```bash
git push origin feature/external-api-routing-config
```

### 8. Open a Pull Request

PR target:

```text
feature/external-api-routing-config -> main
```

Recommended PR title:

```text
Add routing external API and environment-based configuration
```

Recommended PR description:

```text
This PR adds the missing routing/geolocation external API integration using OpenRouteService, keeps the existing OpenWeather integration, moves secrets to environment variables, and adds caching, timeouts, and rate limiting for external API calls.
```

---

## Short Final Summary

This update completes and documents the backend work for Route Mobility and the required external API integrations.

It adds OpenRouteService as the routing/geolocation provider, keeps OpenWeatherMap as the contextual weather provider, moves sensitive values to `.env`, adds caching/timeouts/rate limiting, and connects external routing to the existing route mobility logic with a safe local fallback.
