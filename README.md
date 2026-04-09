# Intelligent API Monitoring & Alert System - Backend

This is the backend for the Intelligent API Monitoring System, built with Node.js, Express, and MongoDB, following a modular architecture and enhanced with Gemini AI for intelligent alert analysis.

## 🚀 Key Features

- **Modular Pattern**: Clean separation of concerns (Controllers, Services, Models, Routes).
- **Asynchronous Task Processing**: Utilizes **BullMQ** and **Redis** for non-blocking AI analysis, ensuring sub-200ms TTFB.
- **Intelligent Alerts**: Integration with **Google Gemini 2.0 Flash** to generate human-readable alert summaries.
- **Distributed Caching**: **Redis** caching (with in-memory fallback) for repetitive AI analysis to reduce latency and cost.
- **Anomaly Detection**: 
  - Status Code Errors (4xx, 5xx).
  - High Latency (Response Time > 2000ms).
  - Zero Records Returned (even on 200 OK status).
- **Email Notifications**: Automated HTML email alerts for **High** and **CRITICAL** severity anomalies using Nodemailer.
- **Flexible Data Input**: Support for both raw JSON payloads and file uploads.

## 🏗️ Architecture Overview

The system follows a modular backend design with a distributed task-based architecture.

```
src/
 ├── modules/
 │    ├── user/       # User Profile & Management
 │    ├── auth/       # Authentication (Login/Register)
 │    ├── monitor/    # API Log Processing
 │    ├── alert/      # Alert Storage & Retrieval
 ├── queues/          # BullMQ Queue Definitions (Producer)
 ├── workers/         # BullMQ Workers (Consumer)
 ├── cache/           # Redis/In-memory Caching Layer
 ├── utils/           # AI (Gemini), Email, Multer, and JWT Utilities
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- **Redis Server**: 
  - Recommended: **v6.2.0 or higher** (Required for optimal BullMQ performance).
  - Minimum: v5.0.0 (May show version warnings in logs).
- Google Gemini API Key

### Installation

1.  **Clone and Install:**
    ```bash
    git clone <repository_url>
    cd Intelligent_API_Monitoring_System/backend
    npm install
    ```
2.  **Environment Variables:**
    Create a `.env` file based on `.env.example`:
    ```env
    PORT=5000
    DATABASE_URL=mongodb://localhost:27017/api_monitor
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    REDIS_PASSWORD=  # Leave blank if your local Redis has no password
    GEMINI_API_KEY=your_gemini_api_key
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password
    ADMIN_EMAIL=admin@example.com
    ```

## 📡 API Endpoints & Input Methods

All API routes are prefixed with `/api/v1`.

### 1. Authentication
- `POST /auth/register` - Create an account.
- `POST /auth/login` - Authenticate and get tokens.

### 2. Monitoring (`POST /monitor`)
You can provide input to the system using either of the following methods:

#### Method A: Raw JSON Array (Direct Body)
```json
[
  {
    "api_name": "PatientDataAPI",
    "response_time_ms": 1200,
    "status_code": 200,
    "records_returned": 50
  }
]
```

#### Method B: Object-Wrapped Array (Body)
```json
{
  "apiResponses": [
    {
      "api_name": "BillingGateway",
      "response_time_ms": 150,
      "status_code": 200,
      "records_returned": 0,
      "timestamp": "2026-04-09T13:15:00Z"
    }
  ]
}
```

#### Method C: Static JSON File Upload
Upload a `.json` file containing any of the above formats using the field name `file` in a `multipart/form-data` request.

### 3. Alerts
- `GET /alerts` - Fetch all detected anomalies for the user.
- `PATCH /alerts/:id/resolve` - Mark an alert as resolved.

## 🤖 AI & Worker Workflow

1. **Monitor**: Endpoint receives data and enqueues a job.
2. **Worker**: Consumes job from BullMQ.
3. **Cache Check**: Looks for existing AI analysis in Redis.
4. **AI Analysis**: If cache miss, calls **Gemini 2.0 Flash** for root cause and recommendations.
5. **Notify**: Updates DB and sends email for critical failures.

## 💻 Run Instructions

```bash
# Development Mode
npm run dev

# Production Build
npm run build
npm start
```
