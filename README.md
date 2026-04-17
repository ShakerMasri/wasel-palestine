🇵🇸 Wasel Palestine - Checkpoint & Incident API
📖 Overview
The Wasel Palestine API is designed to monitor and manage real-time road conditions and military checkpoints. It allows citizens to report incidents and track the status of key transit points.
A standout feature of this system is its Automated Geocoding Engine, which automatically converts geographic coordinates into precise street addresses (e.g., "King Faisal Street, Nablus") using the Nominatim API, ensuring reports are easily understood by all users.

🛠️ Tech Stack
Backend Framework: NestJS

Database: PostgreSQL / MySQL (Managed via TypeORM)

Geocoding Service: Nominatim OpenStreetMap API

Authentication & Security: JWT & Passport.js

Validation: class-validator & class-transformer

⚙️ Prerequisites
Before running the project, make sure you have the following installed:

Node.js (version 18 or higher)

Database Instance (MySQL or PostgreSQL)

Postman (for testing the API endpoints)

🚀 Setup & Run
1. Install Dependencies
Open the terminal in the project directory and run:

Bash
npm install
2. Configure Environment
Create a .env file in the root directory and add your database and JWT credentials:

Code snippet
DB_HOST=localhost
DB_NAME=wasel_db
JWT_SECRET=yazan_secret_key_2026
3. Run the Server
In development mode, the system will automatically sync your database entities.

Bash
npm run start:dev
The server will run by default at: http://localhost:3000

🔗 API Endpoints
To test protected endpoints, you must first log in via the Auth module, copy the access_token, and use it as a Bearer Token in Postman.

1. Create a New Incident (Report)
Endpoint: POST /incidents

Authentication: 🔒 Requires login (JWT)

Description: Creates a new incident report. The system automatically fetches the street address based on the coordinates provided.

Request Body:

JSON
{
  "checkpointId": 1,
  "type": "Closed",
  "severity": "High",
  "description": "Heavy inspection at the main entrance.",
  "lat": 32.2227,
  "lon": 35.2621
}
2. Get All Incidents
Endpoint: GET /incidents

Authentication: 🌐 Public

Description: Retrieves all incidents with support for pagination and status filtering.

3. Update Incident Status
Endpoint: PATCH /incidents/:id

Authentication: 🔒 Requires login (JWT)

Description: Allows authorities or admins to verify a report or update its description.

Request Body:

JSON
{
  "isVerified": true,
  "description": "Status confirmed by field sources."
}
4. System Statistics
Endpoint: GET /incidents/stats/summary

Description: Provides a summary of total reports, high-severity alerts, and verified incidents.

🗄️ Database Schema & Relationships
To ensure data integrity, the system uses the following relational structure:

Users Table: Stores credentials and profile information.

Checkpoints Table: Contains the master list of monitored locations.

Incidents Table: This table has a Many-to-One relationship with both users and checkpoints.

One user can submit multiple reports.

Many reports can be linked to a single checkpoint to track its status history.

🛡️ Validation & Security
Global ValidationPipe: All incoming data is strictly validated.

Whitelist Filtering: Any unexpected properties in the request body are automatically rejected.

AuthGuard: Ensures that only authenticated users can contribute to the reporting system.

Developed by Yazan