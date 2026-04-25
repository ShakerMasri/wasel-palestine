# Wasel Palestine APIs

## Overview

This project provides backend services for managing real-time reports related to road conditions, incidents, and checkpoints. It is designed to support efficient data collection, processing, and retrieval to improve situational awareness and response.

The system is divided into two main modules:

- Checkpoints & Incidents Module  
  Handles reports related to checkpoints, delays, closures, and other road incidents. It includes automated geocoding to convert GPS coordinates into human-readable addresses.

- Route Mobility Module  
  Manages citizen-reported road issues such as potholes, traffic signal failures, and accidents, with precise geographic location tracking.

---

## Tech Stack

- Backend Framework: NestJS  
- Database: PostgreSQL (Dockerized)  
- ORM: TypeORM  
- Authentication: JWT & Passport.js  
- Validation: class-validator & class-transformer  
- Geolocation Services: Nominatim OpenStreetMap API  

---

## Prerequisites

Ensure the following tools are installed:

- Node.js (v16 or higher)  
- Docker Desktop  
- Postman  

---

## Setup & Run

### 1. Start the Database

```bash
docker-compose up -d
```
The database runs on port 5433 to avoid conflicts with local PostgreSQL instances.

### 2. Install Dependencies
```bash
npm install
```
### 3. Run the Application
```bash
npm run start:dev
```
The server will run at:
```bash
http://localhost:3000
```
## Authentication

- Some endpoints require JWT authentication.

Steps:

- Log in via the Auth endpoint
- Copy the access_token
- Add it in Postman under Authorization → Bearer Token
---
## Checkpoints & Incidents Module
Description

This module manages reports related to checkpoints and road incidents. Each report is linked to a user and includes geographic coordinates that are converted into human-readable addresses.

## Features
- Checkpoint tracking with status history
- Incident classification by type and severity
- Filtering, sorting, and pagination support
---

##API Endpoints
POST /incidents

##Requires authentication
```bash

{
  "checkpointId": 1,
  "type": "Closed",
  "severity": "High",
  "description": "Heavy inspections and long queues.",
  "lat": 32.2227,
  "lon": 35.2621
}
```
GET /incidents

Public endpoint to retrieve all incidents.

PATCH /incidents/:id

Requires authentication
```bash

{
  "isVerified": true,
  "description": "Confirmed by multiple reports."
}
```
GET /incidents/stats/summary

Public endpoint that returns system statistics.

## External Integration

The system uses the Nominatim API to convert geographic coordinates into readable addresses.

## Database Structure
- users: stores user information
- checkpoints: stores checkpoint data
- incidents: linked to users and checkpoints (Many-to-One)
---
## Validation & Security
- Global ValidationPipe is enabled 
- Non-whitelisted properties are rejected
- AuthGuard protects secured endpoints
- Each report is linked to a single user
---
