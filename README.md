# 🇵🇸 Wasel Palestine — Checkpoints & Incidents API

## 📖 Overview

The **Checkpoints & Incidents** module handles and manages real-time reports related to military checkpoints and road conditions across Palestine.

Each report is automatically linked to the authenticated user who created it and processed through an **Automated Geocoding Engine** — converting raw GPS coordinates (`lat`, `lon`) into precise, human-readable street addresses via the **Nominatim API**, enabling citizens and authorities to identify locations instantly.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | NestJS |
| Database | PostgreSQL (via Docker) |
| ORM | TypeORM |
| Maps Integration | Nominatim OpenStreetMap API |
| Auth & Security | JWT & Passport.js |
| Validation | class-validator & class-transformer |

---

## ⚙️ Prerequisites

Ensure the following are installed before running the project:

- [Node.js](https://nodejs.org/) v18 or higher
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Postman](https://www.postman.com/) — for testing API endpoints

---

## 🚀 Setup & Run

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

> Server runs at: **`http://localhost:3000`**

---

## 🔗 API Endpoints

> **Authentication:** For protected endpoints, log in via the Auth endpoint, copy the `access_token`, and add it in Postman under **Authorization → Bearer Token**.

### 1. `POST /incidents` — Create a New Report
🔒 **Requires Authentication (JWT)**

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

### 2. `GET /incidents` — Get All Incidents
🌐 **Public**

Retrieves all incidents stored in the database, including resolved location names.

---

### 3. `PATCH /incidents/:id` — Update an Incident
🔒 **Requires Authentication (JWT)**

Updates the verification status or description of a specific report.

```json
{
  "isVerified": true,
  "description": "Confirmed by multiple field reports."
}
```

---

### 4. `GET /incidents/stats/summary` — System Statistics
🌐 **Public**

Returns a statistical summary of all reports and high-severity alerts.

---

## 🗄️ Database Schema & Relationships

| Table | Description |
|---|---|
| `users` | Stores authenticated user info (name, email, hashed password) |
| `checkpoints` | Master list of monitored locations |
| `incidents` | Links to both `users` and `checkpoints` via Many-to-One relationships |

- A single **user** can submit multiple reports.
- Each **report** belongs to exactly one user and one checkpoint.

---

## 🛡️ Validation & Security

- A **global `ValidationPipe`** is applied across the entire application.
- Any **non-whitelisted properties** in request bodies are automatically rejected.
- **`AuthGuard`** enforces that only authenticated users can create or update reports.

---

<p align="center">Developed with ❤️ by <strong>Yazan</strong> 🇵🇸</p>
