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

## 🚀 Setup & Run

### 1. Set Up and Start the Database

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