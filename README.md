# Yoyo Transport Management System

This repository contains the complete source code for the Yoyo Transport system, featuring:

1.  **Mobile App**: A single Flutter application for both Users and Drivers.
    -   Login Screen with role selection.
    -   **User Portal**: Booking lorries and tracking.
    -   **Driver Portal**: managing trips and expenses.
2.  **Frontend**: A Super Admin Web Portal built with React and Tailwind CSS v4.
    -   Dashboard for fleet overview.
    -   Management for Lorries, Drivers, and Trips.
3.  **Backend**: A Node.js (Express) API for authentication and data management.

## Prerequisites

-   Node.js (v18+)
-   Flutter SDK
-   PostgreSQL (optional for now, mock data used)

## Getting Started

### 1. Backend

Navigate to `backend` directory:
```bash
cd backend
npm install
node index.js
```
Server runs on `http://localhost:5000`.

### 2. Frontend (Admin Portal)

Navigate to `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
Access the portal at `http://localhost:5173`.

### 3. Mobile App

Navigate to `mobile_app` directory:
```bash
cd mobile_app
flutter pub get
flutter run
```
Use an emulator or physical device.
-   **Login as User**: Select "User" role -> Directs to User Portal.
-   **Login as Driver**: Select "Driver" role -> Directs to Driver Portal.

## Project Structure

-   `backend/`: API server.
-   `frontend/`: React admin dashboard.
-   `mobile_app/`: Flutter mobile application.
-   `application.txt`: Project requirements and specifications.
