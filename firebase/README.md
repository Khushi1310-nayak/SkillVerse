# 🔥 Firebase Architecture & Security Documentation

This directory contains the core configuration, SDK initializers, and documentation for **SkillVerse**'s Firebase backend infrastructure, including **Firestore Database**, **Authentication**, **Cloud Storage**, and **Cloud Functions**.

---

## 📐 1. Firestore Database Schema

Firestore operates as a NoSQL document database organized into top-level collections:

### 👤 `users` Collection (`/users/{userId}`)
Stores user profile information, learning progression, XP stats, and app settings.

| Field | Type | Description |
|---|---|---|
| `uid` | `string` | Unique Firebase Auth User ID |
| `email` | `string` | User's registered email address |
| `displayName` | `string` | User's display name |
| `photoURL` | `string` | Profile picture URL (or empty if using preset avatar) |
| `xp` | `number` | Total experience points earned across all courses & quizzes |
| `level` | `number` | Computed user level based on total XP |
| `streak` | `number` | Current consecutive daily learning streak count |
| `role` | `string` | User authorization role (`"user"` or `"admin"`) |
| `inventory` | `string[]` | Array of unlocked theme & cursor item IDs |
| `settings` | `object` | User preferences (`theme`, `activeTheme`, `avatarId`, `gradientIntensity`, `soundEffects`) |
| `createdAt` | `Timestamp` | User account creation timestamp |
| `lastLogin` | `Timestamp` | Last session authentication timestamp |

---

### 📚 `courses` Collection (`/courses/{courseId}`)
Stores the main learning curriculum, course metadata, and chapter definitions.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique course identifier (e.g., `"react-mastery"`) |
| `title` | `string` | Course title |
| `description` | `string` | Detailed course overview |
| `category` | `string` | Category key (`"programming"`, `"dsa"`, or `"design"`) |
| `icon` | `string` | Lucide icon identifier |
| `level` | `string` | Difficulty level (`"Beginner"`, `"Intermediate"`, `"Advanced"`) |
| `duration` | `string` | Estimated completion time (e.g., `"4 hours"`) |
| `chapters` | `array` | List of chapter objects containing lesson titles & content |
| `updatedAt` | `Timestamp` | Last modification timestamp |

---

### ❓ `quizzes` Collection (`/quizzes/{courseId}`)
Stores interactive quiz question banks associated with each course module.

| Field | Type | Description |
|---|---|---|
| `courseId` | `string` | Parent course ID match |
| `questions` | `array` | List of question objects with `question`, `options`, and `correctAnswer` index |
| `updatedAt` | `Timestamp` | Last modification timestamp |

---

### 🏢 `companies` Collection (`/companies/{companyId}`)
Stores target company interview prep tracks for **Career Mode**.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique company identifier (e.g., `"google"`, `"meta"`) |
| `name` | `string` | Target company name |
| `logo` | `string` | Company brand logo image URL |
| `description` | `string` | Company interview process summary |
| `category` | `string` | Primary track (`"Frontend"`, `"Backend"`, `"Fullstack"`, `"System Design"`) |
| `interviewQuestions`| `array` | Question bank objects with problem descriptions & hints |
| `lastUpdated` | `Timestamp` | Timestamp of last question rotation |

---

## 🔒 2. Security Rules & Access Control

Firestore security constraints are declared in [`firestore.rules`](../firestore.rules).

### 🔑 Security Principles
1. **User Data Isolation (`/users/{userId}`)**:
   - **Read**: Authenticated users can read user documents (required for the real-time **Leaderboard** snapshot query).
   - **Create & Update**: Users can only create or edit **their own document** (`request.auth.uid == userId`).
   - **Role Protection**: Non-admin users cannot alter their own `role` field.
2. **Public Curriculum (`/courses`, `/companies`)**:
   - **Read**: Publicly accessible to both guest visitors and authenticated users.
   - **Write**: Restricted strictly to users with `role == "admin"`.
3. **Quizzes (`/quizzes`)**:
   - **Read**: Accessible to all authenticated users.
   - **Write**: Restricted strictly to admins.

---

## 🚀 3. Deployment & Firebase CLI Instructions

### Prerequisites
Install the Firebase CLI globally:
```bash
npm install -g firebase-tools
```

Authenticate with Firebase:
```bash
firebase login
```

---

### 📤 Deploying Security Rules

To deploy updated Firestore Security Rules to production:
```bash
firebase deploy --only firestore:rules
```

To deploy Storage Security Rules:
```bash
firebase deploy --only storage
```

To deploy all Firebase resources (Firestore rules, Cloud Storage rules, and Cloud Functions):
```bash
firebase deploy
```

---

### 🧪 Local Testing with Emulators

Run the Firebase Local Emulator Suite for offline testing:
```bash
firebase emulators:start
```
This starts local emulators for Auth, Firestore, and Cloud Functions on `http://localhost:8080`.
