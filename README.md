# ­ƒçÁ­ƒç© Wasel Palestine - Checkpoints & Incidents API

## ­ƒôû Overview

The **Checkpoints & Incidents** module is responsible for handling and managing real-time reports related to military checkpoints and road conditions in Palestine.
Each report is automatically linked to the user who created it and includes an **Automated Geocoding Engine**. This engine converts GPS coordinates ($lat, lon$) into precise street addresses using the Nominatim API to help citizens and authorities identify locations instantly.

## ­ƒøá´©Å Tech Stack

* **Backend Framework:** NestJS
* **Database:** PostgreSQL (running via Docker)
* **ORM:** TypeORM
* **Maps Integration:** Nominatim OpenStreetMap API
* **Authentication & Security:** JWT & Passport.js
* **Validation:** class-validator & class-transformer

## ÔÜÖ´©Å Prerequisites

Before running the project, make sure you have the following installed:
* **Node.js** (version 18 or higher)
* **Docker Desktop**
* **Postman** (for testing the API endpoints)
# ­ƒçÁ­ƒç© Wasel Palestine - Route Mobility API

## ­ƒôû Overview
The **Route Mobility** module is responsible for handling and managing citizen reports related to road conditions, such as potholes, traffic signal malfunctions, and accidents.

Each report is automatically linked to the user who created it and includes precise geographic coordinates to help authorities quickly locate and resolve the issue.

---

## ­ƒøá´©Å Tech Stack
- **Backend Framework:** NestJS
- **Database:** PostgreSQL (running via Docker)
- **ORM:** TypeORM
- **Authentication & Security:** JWT & Passport.js
- **Validation:** class-validator & class-transformer

---

## ÔÜÖ´©Å Prerequisites
Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Postman](https://www.postman.com/) (for testing the API endpoints)

---

## ­ƒÜÇ Setup & Run

### 1. Set Up and Start the Database

The project uses Docker to run a clean PostgreSQL database environment.
The project uses Docker to run a clean PostgreSQL database environment.  
Open the terminal in the project directory and run:

```bash
docker-compose up -d

Note: The database is configured to run on port 5433 to avoid conflicts with other local PostgreSQL instances.

2. Install Dependencies
Bash
npm install
3. Run the Server
In development mode, TypeORM uses synchronize: true to automatically create and update database tables.
# ­ƒçÁ­ƒç© Wasel Palestine ÔÇö Checkpoints & Incidents API

## ­ƒôû Overview

The **Checkpoints & Incidents** module handles and manages real-time reports related to military checkpoints and road conditions across Palestine.

Each report is automatically linked to the authenticated user who created it and processed through an **Automated Geocoding Engine** ÔÇö converting raw GPS coordinates (`lat`, `lon`) into precise, human-readable street addresses via the **Nominatim API**, enabling citizens and authorities to identify locations instantly.

---

## ­ƒøá´©Å Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | NestJS |
| Database | PostgreSQL (via Docker) |
| ORM | TypeORM |
| Maps Integration | Nominatim OpenStreetMap API |
| Auth & Security | JWT & Passport.js |
| Validation | class-validator & class-transformer |

---

## ÔÜÖ´©Å Prerequisites

Ensure the following are installed before running the project:

- [Node.js](https://nodejs.org/) v18 or higher
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Postman](https://www.postman.com/) ÔÇö for testing API endpoints

---

## ­ƒÜÇ Setup & Run

### 1. Start the Database

The project uses Docker to spin up a clean PostgreSQL environment.

```bash
docker-compose up -d
```

> **Note:** The database is configured on port `5433` to avoid conflicts with any local PostgreSQL instances.

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

TypeORM runs with `synchronize: true` in development mode, automatically creating and updating database tables.

```bash
npm run start:dev
```

­ƒöù API Endpoints
To test protected endpoints that require authentication (JWT), you must first log in through the Auth endpoint, copy the access_token, and then add it in Postman under Authorization using Bearer Token.

1. Create a New Incident Report
Endpoint: POST /incidents
> Server runs at: **`http://localhost:3000`**

---

## ­ƒÜº Road Incidents & Checkpoint Management

Description: Creates a new report. The system automatically fetches the human-readable address from the coordinates provided.

Request Body
A centralized system for monitoring and managing checkpoints, road closures, delays, and hazardous conditions across the road network.

### Core Features

- **Checkpoint Registry** ÔÇö Maintains a comprehensive, up-to-date registry of all monitored checkpoints, each with a full **status history** to track changes and conditions over time.

- **Incident Categorization** ÔÇö Incidents are classified by **type** (closure, delay, accident, weather hazard, etc.) and **severity level**, enabling prioritized response and clear situational awareness.

- **Role-Based Management** ÔÇö Authorized users (moderators & admins) have full control to **create, update, verify, and close** incidents through protected API endpoints.

- **Advanced Querying** ÔÇö Full support for **filtering, sorting, and pagination** across all incident and checkpoint endpoints for efficient data retrieval.

---

## ­ƒîÉ External API Integration

To enhance data accuracy and comprehensiveness, the platform integrates with external APIs that provide information from authoritative third-party sources.

### Geolocation & Routing

Integration with **OpenStreetMap-based providers** (via the Nominatim API) enables automatic reverse geocoding ÔÇö converting raw GPS coordinates into precise, human-readable street addresses in real time.

> This ensures every reported incident is tied to a verified, recognizable location ÔÇö removing ambiguity and improving response time for both citizens and field teams.

---

## ­ƒöù API Endpoints

> **Authentication:** For protected endpoints, log in via the Auth endpoint, copy the `access_token`, and add it in Postman under **Authorization ÔåÆ Bearer Token**.

### 1. `POST /incidents` ÔÇö Create a New Report
­ƒöÆ **Requires Authentication (JWT)**

Creates a new incident report. The system automatically resolves a human-readable address from the provided coordinates.

```json
{
  "checkpointId": 1,
  "type": "Closed",
  "severity": "High",
  "description": "Heavy inspections and long queues at the entrance.",
  "lat": 32.2227,
  "lon": 35.2621
}
```

---

Description: Retrieves all incidents stored in the database, including their resolved location names.

3. Update Incident/Status
Endpoint: PATCH /incidents/:id
### 2. `GET /incidents` ÔÇö Get All Incidents
­ƒîÉ **Public**

Retrieves all incidents stored in the database, including resolved location names.

---

Description: Updates the verification status or description of a specific report.

Request Body
### 3. `PATCH /incidents/:id` ÔÇö Update an Incident
­ƒöÆ **Requires Authentication (JWT)**

Updates the verification status or description of a specific report.

```json
{
  "isVerified": true,
  "description": "Confirmed by multiple field reports."
}
4. Get System Statistics
Endpoint: GET /incidents/stats/summary

Authentication: ­ƒîÉ Public

Description: Retrieves a statistical summary of reports and high-severity alerts.

­ƒùä´©Å Database Schema & Relationships
The following tables and relationships were designed to ensure data integrity:

users: Stores authenticated user information (name, email, and hashed password).

checkpoints: Stores the master list of monitored locations.

incidents: This table has a Many-to-One relationship with both users and checkpoints:
```

---

### 4. `GET /incidents/stats/summary` ÔÇö System Statistics
­ƒîÉ **Public**

Returns a statistical summary of all reports and high-severity alerts.

---

## ­ƒùä´©Å Database Schema & Relationships


| Table | Description |
|---|---|
| `users` | Stores authenticated user info (name, email, hashed password) |
| `checkpoints` | Master list of monitored locations |
| `incidents` | Links to both `users` and `checkpoints` via Many-to-One relationships |

Each report belongs to one specific user and one specific checkpoint.

­ƒøí´©Å Validation & Security
A global ValidationPipe is enabled across the application.

Any non-whitelisted properties are rejected to prevent malicious or unexpected input.

AuthGuard is used to ensure that only authenticated users can create or update reports.

Developed by Yazan
```

> **Note:** The database is configured to run on port `5433` to avoid conflicts with other local PostgreSQL instances.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Server
In development mode, TypeORM uses `synchronize: true` to automatically create and update database tables.

```bash
npm run start:dev
```

The server will run by default at: `http://localhost:3000`

---

## ­ƒöù API Endpoints

To test protected endpoints that require authentication (JWT), you must first log in through the **Auth** endpoint, copy the `access_token`, and then add it in Postman under **Authorization** using **Bearer Token**.

### 1. Create a New Report
- **Endpoint:** `POST /route-mobility/report`
- **Authentication:** ­ƒöÆ Requires login (JWT)
- **Description:** Creates a new report and links it to the authenticated user's ID extracted from the token.

#### Request Body
```json
{
  "category": "Pothole",
  "description": "There is a deep pothole obstructing traffic at the main intersection.",
  "latitude": 32.22111,
  "longitude": 35.25444
}
```

### 2. Get All Reports
- **Endpoint:** `GET /route-mobility/reports`
- **Authentication:** ­ƒîÉ Public
- **Description:** Retrieves all reports stored in the database for display, such as on a map.

### 3. Update Report Status
- **Endpoint:** `PATCH /route-mobility/report/:id/status`
- **Authentication:** ­ƒöÆ Requires login (JWT)
- **Description:** Updates the status of a report, for example from `Pending` to `In Progress`.

#### Request Body
```json
{
  "status": "In Progress"
}
```

---

## ­ƒùä´©Å Database Schema & Relationships
The following tables and relationships were designed to ensure data integrity:

- **`users`**  
  Stores authenticated user information such as name, email, and hashed password.

- **`user_reports`**  
  Stores report details. This table has a **Many-to-One** relationship with the `users` table, which means:
  - One user can submit multiple reports
  - Each report belongs to one specific user

---

## ­ƒøí´©Å Validation & Security
- A global **ValidationPipe** is enabled across the application.
- Any non-whitelisted properties are rejected to prevent malicious or unexpected input.
- `AuthGuard` is used to ensure that only authenticated users can create or update reports.
- A single **user** can submit multiple reports.
- Each **report** belongs to exactly one user and one checkpoint.

---

## ­ƒøí´©Å Validation & Security

- A **global `ValidationPipe`** is applied across the entire application.
- Any **non-whitelisted properties** in request bodies are automatically rejected.
- **`AuthGuard`** enforces that only authenticated users can create or update reports.

---

<p align="center">Developed with ÔØñ´©Å by <strong>Yazan</strong> ­ƒçÁ­ƒç©</p>

