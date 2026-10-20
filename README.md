# 🏥 Hospital Management System (HMS) - Frontend

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.2.3-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Material UI](https://img.shields.io/badge/MUI-v5.15-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![React Router](https://img.shields.io/badge/React%20Router-v6-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)

A modern, responsive web application for managing healthcare and medical clinic operations in academic/institutional environments. Designed with native **RTL (Right-to-Left)** support, tailored typography (Cairo), dynamic Permission-Based Access Control (**PBAC**), and real-time operational workflows.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [User Roles & Access Levels](#user-roles--access-levels)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [API & HTTP Client](#api--http-client)
- [Folder Structure](#folder-structure)
- [License](#license)

---

## 🌟 Overview

The **HMS Frontend** (`hsu-gp`) streamlines patient clinic reservations, counter triage, external hospital referrals, and medical system administration. It provides a role-tailored user experience that accommodates students/patients, clinic reception desk counters, transfer managers, medical examiners, and system administrators.

---

## ✨ Key Features

### 👤 Student & Patient Portal
- **Clinic Reservations**: Search available clinics and book medical appointments.
- **Medical Profile & History**: View personal visit history, past diagnoses, and medical status.
- **Document Verification Guard**: Gate critical actions based on required student documentation status.
- **Account Management**: Profile editing, secure password changes, and OTP-based verification.

### 🎫 Counter & Queue Management
- **Desk Operations**: Manage incoming clinic appointments, patient check-ins, and counter queues.
- **Status Updates**: Real-time reservation status updates (approved, pending, completed).

### 🚑 Hospital Transfers
- **External Referrals**: Process and track patient transfers to specialized partner hospitals.
- **Transfer Orders**: Manage transfer approvals, paperwork, and patient status updates.

### 🛡️ Administration & System Management
- **Staff & Admin Management**: Create, update, filter, and assign roles and permissions to system administrators.
- **System Lookups**: Maintain foundational reference data:
  - Clinics & Medical Specialties
  - Academic Faculties
  - Academic Levels
  - External Partner Hospitals
  - Governorates
- **User Directory**: Search, inspect, activate/deactivate, and export student/patient records to CSV.
- **System Audit Logs**: Track activity and operational history across the platform.

### 🔐 Security & Access Control
- **JWT Authentication**: Seamless token storage and automatic bearer injection via Axios interceptors.
- **Permission-Based Access Control (PBAC)**: Granular route guards verifying specific resource permissions (e.g., `admins:read`, `transfers:read`, `users:read`, `logs:read`).
- **OTP Verification Flow**: Email verification and password recovery with multi-step OTP inputs.

---

## 👥 User Roles & Access Levels

| Role (Arabic) | Role Identifier | Primary Responsibilities |
| :--- | :--- | :--- |
| **طالب / مريض** | `user` | Clinic appointment booking, profile & medical history view |
| **كاونتر** | `counter` / `كاونتر` | Patient check-ins, attendance verification, counter queue |
| **مسؤول التحويلات** | `transfer` / `مسؤول التحويلات` | Referral workflow and external hospital transfers |
| **مسؤول الكشف الطبي** | `medical_check_manager` | Student medical examination review and validation |
| **أدمن مستشفي خارجي** | `external_hospital_admin` | External hospital administration and referral management |
| **ملاحظ** | `viewer` / `ملاحظ` | Read-only administrative observation and metrics monitoring |
| **مدير ثان** | `second_manager` / `مدير ثان` | Secondary administrative supervision and data management |
| **مدير النظام** | `super_admin` / `مدير النظام` | Full system governance, lookup settings, permissions & logs |

---

## 🛠️ Tech Stack

- **Core**: [React 18](https://reactjs.org/) (Create React App), JavaScript (ES6+)
- **Routing**: [React Router v6](https://reactrouter.com/) (Nested routes, layout outlets, guards)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **UI Components & Styling**:
  - [Material UI (MUI v5)](https://mui.com/)
  - [Styled Components](https://styled-components.com/) & [Emotion](https://emotion.sh/)
  - [Framer Motion](https://www.framer.com/motion/) (Micro-animations and transitions)
  - [FontAwesome](https://fontawesome.com/) & [Google Material Symbols](https://fonts.google.com/icons)
- **Date Handling**: [MUI X Date Pickers](https://mui.com/x/react-date-pickers/) with [Day.js](https://day.js.org/)
- **Feedback & Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/) & [SweetAlert](https://sweetalert.js.org/)
- **Data Export**: [react-csv](https://github.com/react-csv/react-csv)

---

## 📁 Project Architecture

The codebase follows a modular, feature-based architecture:

```text
HMS-front/
├── public/                 # Static assets, HTML shell with RTL & Cairo font
└── src/
    ├── components/         # Shared, reusable UI widgets and primitives
    ├── config/             # Navigation and application configuration
    ├── features/           # Domain-driven feature modules
    │   ├── admins/         # Admin management, staff lists, and filters
    │   ├── auth/           # Login, signup, password reset, OTP verification
    │   ├── history/        # Audit logs and system activity records
    │   ├── lookups/        # System data (clinics, faculties, levels, hospitals)
    │   ├── profile/        # Patient and admin profile details & histories
    │   ├── reservations/   # Clinic appointments and counter desk views
    │   ├── transfers/      # External hospital transfer management
    │   └── users/          # Student/user directory and controls
    ├── hooks/              # Custom React hooks
    ├── layouts/            # Base layouts & dynamic role-based SideBars
    ├── routes/             # Route guards (UserGuard, AdminGuard, PermissionGuard)
    ├── services/           # HTTP client, Axios interceptors, token storage
    ├── store/              # Redux Toolkit store and RTK Query API slice
    └── utils/              # PBAC permissions, date helpers, formatters
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (`v16.x` or higher recommended)
- [npm](https://www.npmjs.com/) (`v8.x` or higher) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abdelkhalek002/HMS-front.git
   cd HMS-front
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root directory to configure the backend API endpoint:

```env
REACT_APP_API_BASE_URL=http://localhost:7000/api/v1
```

> **Note:** If `REACT_APP_API_BASE_URL` is omitted, the client defaults to `http://localhost:7000/api/v1`.

### Running the App

Start the development server:
```bash
npm start
```
The application will launch automatically in your browser at `http://localhost:3000`.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm start` | Runs the app in development mode at `http://localhost:3000`. |
| `npm run build` | Builds the app for production to the `build` folder. Optimizes build for performance. |
| `npm test` | Launches the test runner in interactive watch mode. |
| `npm run eject` | Ejects from Create React App configuration (**Warning: irreversible**). |

---

## 🌐 API & HTTP Client

All network requests are handled through a centralized Axios instance located at [`src/services/http/apiClient.js`](file:///d:/www/HMS-front/src/services/http/apiClient.js):
- **Authorization Header**: Bearer tokens are automatically retrieved from Redux state or local storage and injected into outgoing requests.
- **Error Interceptors**: Global interceptor handling for 401 Unauthorized responses and API error alerts.

---

## 📄 License

This project is developed as part of the Health Services Unit Graduation Project. All rights reserved.
