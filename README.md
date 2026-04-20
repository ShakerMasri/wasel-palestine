<<<<<<< HEAD
# 🇵🇸 Wasel Palestine - Checkpoints & Incidents API

## 📖 Overview

The **Checkpoints & Incidents** module is responsible for handling and managing real-time reports related to military checkpoints and road conditions in Palestine.
Each report is automatically linked to the user who created it and includes an **Automated Geocoding Engine**. This engine converts GPS coordinates ($lat, lon$) into precise street addresses using the Nominatim API to help citizens and authorities identify locations instantly.

## 🛠️ Tech Stack

* **Backend Framework:** NestJS
* **Database:** PostgreSQL (running via Docker)
* **ORM:** TypeORM
* **Maps Integration:** Nominatim OpenStreetMap API
* **Authentication & Security:** JWT & Passport.js
* **Validation:** class-validator & class-transformer

## ⚙️ Prerequisites

Before running the project, make sure you have the following installed:
* **Node.js** (version 18 or higher)
* **Docker Desktop**
* **Postman** (for testing the API endpoints)
=======
# 🇵🇸 Wasel Palestine - Route Mobility API

## 📖 Overview
The **Route Mobility** module is responsible for handling and managing citizen reports related to road conditions, such as potholes, traffic signal malfunctions, and accidents.

Each report is automatically linked to the user who created it and includes precise geographic coordinates to help authorities quickly locate and resolve the issue.

---

## 🛠️ Tech Stack
- **Backend Framework:** NestJS
- **Database:** PostgreSQL (running via Docker)
- **ORM:** TypeORM
- **Authentication & Security:** JWT & Passport.js
- **Validation:** class-validator & class-transformer

---

## ⚙️ Prerequisites
Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Postman](https://www.postman.com/) (for testing the API endpoints)

---
>>>>>>> 2f4a113fd05e464bcbea4d4cd0e6f6d037968205

## 🚀 Setup & Run

### 1. Set Up and Start the Database
<<<<<<< HEAD

The project uses Docker to run a clean PostgreSQL database environment.
=======
The project uses Docker to run a clean PostgreSQL database environment.  
>>>>>>> 2f4a113fd05e464bcbea4d4cd0e6f6d037968205
Open the terminal in the project directory and run:

```bash
docker-compose up -d
<<<<<<< HEAD

Note: The database is configured to run on port 5433 to avoid conflicts with other local PostgreSQL instances.

2. Install Dependencies
Bash
npm install
3. Run the Server
In development mode, TypeORM uses synchronize: true to automatically create and update database tables.

Bash
npm run start:dev
The server will run by default at: http://localhost:3000

🔗 API Endpoints
To test protected endpoints that require authentication (JWT), you must first log in through the Auth endpoint, copy the access_token, and then add it in Postman under Authorization using Bearer Token.

1. Create a New Incident Report
Endpoint: POST /incidents

Authentication: 🔒 Requires login (JWT)

Description: Creates a new report. The system automatically fetches the human-readable address from the coordinates provided.

Request Body

JSON
{
  "checkpointId": 1,
  "type": "Closed",
  "severity": "High",
  "description": "Heavy inspections and long queues at the entrance.",
  "lat": 32.2227,
  "lon": 35.2621
}
2. Get All Incidents
Endpoint: GET /incidents

Authentication: 🌐 Public

Description: Retrieves all incidents stored in the database, including their resolved location names.

3. Update Incident/Status
Endpoint: PATCH /incidents/:id

Authentication: 🔒 Requires login (JWT)

Description: Updates the verification status or description of a specific report.

Request Body

JSON
{
  "isVerified": true,
  "description": "Confirmed by multiple field reports."
}
4. Get System Statistics
Endpoint: GET /incidents/stats/summary

Authentication: 🌐 Public

Description: Retrieves a statistical summary of reports and high-severity alerts.

🗄️ Database Schema & Relationships
The following tables and relationships were designed to ensure data integrity:

users: Stores authenticated user information (name, email, and hashed password).

checkpoints: Stores the master list of monitored locations.

incidents: This table has a Many-to-One relationship with both users and checkpoints:

One user can submit multiple reports.

Each report belongs to one specific user and one specific checkpoint.

🛡️ Validation & Security
A global ValidationPipe is enabled across the application.

Any non-whitelisted properties are rejected to prevent malicious or unexpected input.

AuthGuard is used to ensure that only authenticated users can create or update reports.

Developed by Yazan
=======
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

## 🔗 API Endpoints

To test protected endpoints that require authentication (JWT), you must first log in through the **Auth** endpoint, copy the `access_token`, and then add it in Postman under **Authorization** using **Bearer Token**.

### 1. Create a New Report
- **Endpoint:** `POST /route-mobility/report`
- **Authentication:** 🔒 Requires login (JWT)
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
- **Authentication:** 🌐 Public
- **Description:** Retrieves all reports stored in the database for display, such as on a map.

### 3. Update Report Status
- **Endpoint:** `PATCH /route-mobility/report/:id/status`
- **Authentication:** 🔒 Requires login (JWT)
- **Description:** Updates the status of a report, for example from `Pending` to `In Progress`.

#### Request Body
```json
{
  "status": "In Progress"
}
```

---

## 🗄️ Database Schema & Relationships
The following tables and relationships were designed to ensure data integrity:

- **`users`**  
  Stores authenticated user information such as name, email, and hashed password.

- **`user_reports`**  
  Stores report details. This table has a **Many-to-One** relationship with the `users` table, which means:
  - One user can submit multiple reports
  - Each report belongs to one specific user

---

## 🛡️ Validation & Security
- A global **ValidationPipe** is enabled across the application.
- Any non-whitelisted properties are rejected to prevent malicious or unexpected input.
- `AuthGuard` is used to ensure that only authenticated users can create or update reports.
>>>>>>> 2f4a113fd05e464bcbea4d4cd0e6f6d037968205
