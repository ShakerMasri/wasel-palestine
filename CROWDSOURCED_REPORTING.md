# 🚀 Crowdsourced Reporting System (My Contribution)

## 📌 Overview
This feature implements a **complete crowdsourced reporting system** that enables users to submit, validate, vote on, and moderate mobility-related reports.

The system is designed to be **scalable, clean, and optimized** by preventing duplicate data and ensuring data integrity.

---

## 🌐 Demo / Testing
Use **Apidog** with the provided OpenAPI file to test all endpoints.

---

## 🔗 API Documentation
The full API documentation is available via OpenAPI:

- 📄 `docs/api/wasel-api.json`
- Imported into Apidog for testing and validation

---

## ✅ Features Implemented

### 📍 Report Submission
Users can create reports with the following fields:
- `category`
- `description`
- `latitude`
- `longitude`
- `timestamp`

---

### 🔁 Smart Duplicate Detection
- Detects duplicate reports based on location and similarity
- Instead of inserting a new report:
  - Converts duplicate submissions into an **upvote**

✔ Prevents database pollution  
✔ Improves data quality  

---

### 👍 Voting System
- Users can:
  - Upvote reports
  - Remove their vote
- Constraints:
  - One vote per user per report

---

### 🛠️ Moderation System (Admin Only)
Admins can:
- Approve reports
- Reject reports

✔ Ensures only valid reports are publicly trusted

---

### 📜 Audit Logging
Every moderation action is recorded with:
- `admin_id`
- `report_id`
- `action` (approve / reject)
- `timestamp`

✔ Full traceability  
✔ Supports future analytics  

---

### 🛡️ Abuse Prevention
- Input validation on all endpoints
- Rate limiting applied to:
  - report creation
  - voting actions

✔ Protects system from spam and abuse

---

## 🧠 Key Design Decisions

### 1. Duplicate Handling Strategy
- Duplicate reports are converted into votes instead of new records
- This:
  - Reduces redundancy
  - Keeps reports meaningful

---

### 2. Data Integrity
- Enforced one vote per user per report
- Prevents vote manipulation

---

### 3. Role-Based Access Control
- Admin-only endpoints for moderation
- Secured using JWT authentication

---

## 🧪 Testing

All endpoints were tested using **Apidog**:
- Authentication flow tested (login → token usage)
- Protected endpoints validated with Bearer Token
- Edge cases tested (duplicate reports, voting limits)

---

## 🎯 Final Result

✔ Fully functional system  
✔ Covers all assignment requirements  
✔ Clean architecture and scalable logic  
✔ Documented and testable APIs  

---

## 📦 Project Structure Addition

---

## 👨‍💻 Author
Mohammed
