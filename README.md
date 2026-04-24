# Feature 3 — Route Estimation & Mobility Intelligence

> **Branch note**
>
> This README is intended for the **feature branch implementation** of Feature 3, not necessarily for the current main branch. It documents the work completed for the **Route Estimation & Mobility Intelligence** requirement and the supporting changes needed to make it functional inside the existing Wasel Palestine backend.

---

## 1. Overview

This branch implements **Feature 3: Route Estimation & Mobility Intelligence** for the Wasel Palestine backend.

The goal of this feature is to provide an API endpoint that estimates a route between two locations and returns:

- estimated distance
- estimated duration
- explanatory metadata about route-affecting factors
- support for constraints such as avoiding checkpoints and avoiding specific areas

The implementation is **heuristic-based**, which matches the project requirement that exact routing accuracy is not mandatory.

---

## 2. Why this branch was needed

The original `route-mobility` module in the project structure was still oriented around reporting-style behavior rather than route estimation. Because of that, this branch repurposes the module to match the actual Feature 3 requirement.

In addition, the existing `Checkpoint` model originally had no geographic coordinates, which made route estimation impossible. To fix that, this branch extends the checkpoint data model with latitude and longitude so the route logic can reason about location.

---

## 3. What was implemented

### 3.1 Route estimation endpoint

A dedicated endpoint was implemented for route estimation:

```http
POST /api/v1/route-mobility/estimate
```

This endpoint accepts:

- `startLatitude`
- `startLongitude`
- `endLatitude`
- `endLongitude`
- `mode` (`fastest`, `balanced`, `safest`)
- `avoidCheckpoints`
- `avoidAreas[]`

### 3.2 Heuristic route calculation

The route estimation logic is based on:

- direct geographic distance using the **Haversine formula**
- a route mode multiplier (`fastest`, `balanced`, `safest`)
- penalties caused by nearby checkpoints
- penalties caused by nearby **verified** incidents
- additional detour penalties when the request includes avoided areas

### 3.3 Metadata in the response

The endpoint returns:

- `estimatedDistanceKm`
- `estimatedDurationMinutes`
- `metadata.mode`
- `metadata.directDistanceKm`
- `metadata.baseRoadFactor`
- `metadata.averageSpeedKmh`
- `metadata.avoidCheckpoints`
- `metadata.avoidedAreasCount`
- `metadata.nearbyCheckpointsCount`
- `metadata.nearbyIncidentsCount`
- `metadata.factors[]`
- `metadata.summary`

### 3.4 Checkpoint data model enhancement

To support real routing logic, the `Checkpoint` entity was enhanced with:

- `latitude`
- `longitude`

This was a necessary change, because route estimation cannot work meaningfully if checkpoints only contain textual location data.

### 3.5 Checkpoint DTOs and service/controller updates

The checkpoints module was also improved so checkpoint records can be created and updated with coordinates.

Changes include:

- adding `CreateCheckpointDto`
- adding `UpdateCheckpointDto`
- using DTOs instead of `any`
- supporting checkpoint updates
- keeping route-related data consistent and reusable

---

## 4. Architecture decision

This feature was implemented **without creating a separate RouteMobility database entity**.

That decision was intentional.

Feature 3 only needs to:

- read existing mobility-related data
- estimate a route
- return a response

It does **not** require persisting route estimates to the database.

So the feature works as a computation layer on top of:

- `checkpoint`
- `incident`
- existing JWT-based authentication and versioned API structure

This keeps the design simpler and aligned with the current project architecture.

---

## 5. Request example

```json
{
  "startLatitude": 32.2211,
  "startLongitude": 35.2544,
  "endLatitude": 31.9522,
  "endLongitude": 35.2332,
  "mode": "balanced",
  "avoidCheckpoints": true,
  "avoidAreas": [
    {
      "name": "Avoided block",
      "minLatitude": 32.05,
      "maxLatitude": 32.15,
      "minLongitude": 35.20,
      "maxLongitude": 35.30
    }
  ]
}
```

---

## 6. Response example

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
  "estimatedDistanceKm": 41.87,
  "estimatedDurationMinutes": 64.13,
  "metadata": {
    "mode": "balanced",
    "directDistanceKm": 30.74,
    "baseRoadFactor": 1.25,
    "averageSpeedKmh": 45,
    "avoidCheckpoints": true,
    "avoidedAreasCount": 1,
    "nearbyCheckpointsCount": 2,
    "nearbyIncidentsCount": 1,
    "factors": [
      {
        "type": "checkpoints",
        "message": "Route adjusted to avoid 2 nearby checkpoint(s).",
        "impactDistanceKm": 3.84,
        "impactDurationMinutes": 12
      }
    ],
    "summary": "Estimated route in balanced mode: 41.87 km, 64.13 minutes. Factors considered: 2 checkpoint(s), 1 verified incident(s), 1 avoided area(s)."
  }
}
```

---

## 7. Related modules used by Feature 3

This implementation depends mainly on:

- `checkpoints`
- `incidents`
- `auth`
- `route-mobility`

### Checkpoints
Used as route-affecting map points.

### Incidents
Used as route-affecting events. Verified incidents contribute to penalties in the route estimate.

### Auth
Used for protected endpoints such as checkpoint creation, depending on the project guard configuration.

---

## 8. Suggested file changes in this branch

The exact file list may vary depending on your final branch state, but the intended implementation includes changes similar to:

```text
src/checkpoints/entities/checkpoint.entity.ts
src/checkpoints/dto/create-checkpoint.dto.ts
src/checkpoints/dto/update-checkpoint.dto.ts
src/checkpoints/checkpoints.controller.ts
src/checkpoints/checkpoints.service.ts
src/route-mobility/dto/avoid-area.dto.ts
src/route-mobility/dto/estimate-route.dto.ts
src/route-mobility/route-mobility.controller.ts
src/route-mobility/route-mobility.service.ts
src/route-mobility/route-mobility.module.ts
```

---

## 9. How to run

### Install dependencies

```bash
npm install
```

### Start the database / containers

If your setup uses Docker:

```bash
docker-compose up -d
```

### Run the server

```bash
npm run start:dev
```

The API base path is expected to be:

```text
http://localhost:3000/api/v1
```

---

## 10. How to test the feature

### Step 1 — login
Use the authentication endpoint to obtain a JWT token if the endpoint you are testing is protected.

```http
POST /api/v1/auth/login
```

### Step 2 — create checkpoints with coordinates
Create checkpoints that include:

- name
- location
- latitude
- longitude
- currentStatus

### Step 3 — verify there is incident/checkpoint data
Make sure the database contains checkpoints and incidents that can influence the estimation.

### Step 4 — test the route endpoint
Send a POST request to:

```http
POST /api/v1/route-mobility/estimate
```

using **Postman** or **ApiDog**.

---

## 11. API testing note

Swagger was not the final testing workflow used for this feature branch. The feature was validated more practically through **Postman / ApiDog** requests.

This is especially useful when:

- JWT login is required first
- request bodies need quick iteration
- the branch is under active development

---

## 12. Current limitations

This feature is intentionally heuristic.

That means:

- it does **not** use a real external routing engine yet
- it does **not** calculate exact road graph paths
- accuracy depends on the quality of checkpoint coordinates and verified incident data
- penalties are approximation-based, not traffic-simulation based

This still satisfies the project requirement because exact route precision is not mandatory for Feature 3.

---

## 13. Possible future improvements

If the project is extended later, the next upgrades could include:

- integrating OpenStreetMap / OpenRouteService or another routing API
- adding weather impact into route metadata
- storing route estimation logs for analytics
- returning alternative routes instead of a single estimate
- adding unit and e2e tests specifically for route scenarios
- adding the final endpoint documentation to ApiDog export and collection deliverables

---

## 14. Branch submission note

This work is prepared to live on a **feature branch** and can later be merged into the main branch through the normal Git workflow.

Suggested branch naming examples:

```text
feature/route-mobility
feature/feature-3-route-estimation
```

Suggested PR title:

```text
Implement Feature 3: Route Estimation & Mobility Intelligence
```

---

## 15. Final summary

This branch completes the core implementation of **Feature 3 — Route Estimation & Mobility Intelligence** by:

- adding a dedicated route estimation endpoint
- returning estimated distance and duration
- returning explanatory metadata
- supporting checkpoint avoidance
- supporting avoided areas
- extending checkpoint data with geographic coordinates
- integrating existing checkpoint and incident data into heuristic route logic

In short, this branch transforms `route-mobility` from a non-matching placeholder into a feature that aligns with the actual Feature 3 requirement.
