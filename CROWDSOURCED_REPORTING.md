# 🚀 Crowdsourced Reporting System (My Contribution)

## 📌 Description
This feature implements a complete crowdsourced reporting system that allows users to submit, validate, and moderate mobility-related reports.

---

## ✅ What I Implemented

### 📍 Report Submission
- Users can create reports with:
  - location (latitude, longitude)
  - category
  - description
  - timestamp

---

### 🔁 Smart Duplicate Detection
- Detects duplicate reports globally
- Instead of creating a new report:
  - Automatically converts duplicate into an **upvote**

---

### 👍 Voting System
- Users can:
  - upvote
  - downvote
- Each user can vote only once per report

---

### 🛠️ Moderation System
- Admin-only actions:
  - approve report
  - reject report

---

### 📜 Audit Logging
- Every moderation action is logged:
  - admin_id
  - report_id
  - action
  - timestamp

---

### 🛡️ Abuse Prevention
- Validation for input data
- Rate limiting to prevent spam

---

## 🧠 Key Design Decisions

- Duplicate reports are treated as votes instead of new records
- Keeps database clean and prevents redundancy
- Role-based access control for moderation

---

## 🎯 Result
✔ Fully working feature  
✔ Covers all requirements  
✔ Clean and scalable design  

---

## 👨‍💻 Author
Mohammed