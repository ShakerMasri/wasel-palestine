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

## 🚀 Setup & Run

### 1. Set Up and Start the Database
The project uses Docker to run a clean PostgreSQL database environment.  
Open the terminal in the project directory and run:

```bash
docker-compose up -d
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
