# Intelligent API Monitoring & Alert System - Backend

This is the backend for the Intelligent API Monitoring System, built with Node.js, Express, and MongoDB, following a modular architecture and enhanced with Gemini AI for intelligent alert analysis.

## 🚀 Key Features

- **Modular Pattern**: Clean separation of concerns (Controllers, Services, Models, Routes).
- **Asynchronous Task Processing**: Utilizes **BullMQ** and **Redis** for non-blocking AI analysis, ensuring sub-200ms TTFB.
- **Intelligent Alerts**: Integration with **Google Gemini 2.0 Flash** to generate human-readable alert summaries.
- **Distributed Caching**: **Redis** caching (with in-memory fallback) for repetitive AI analysis to reduce latency and cost.
- **Anomaly Detection**: 
  - Status Code Errors (Non-2xx status codes).
  - High Latency (Response Time > 500ms).
  - Zero Records Returned (even on 200 OK status).

## 🏗️ Architecture Overview

The system follows a modular backend design with a distributed task-based architecture.

```
src/
 ├── modules/
 │    ├── user/       # User Profile & Management
 │    ├── auth/       # Authentication (Login/Register)
 │    ├── monitor/    # API Log Processing (Batch support)
 │    ├── alert/      # Alert Storage & Retrieval
 ├── queues/          # BullMQ Queue Definitions (Producer)
 ├── workers/         # BullMQ Workers (Consumer)
 ├── cache/           # Redis/In-memory Caching Layer
 ├── utils/           # AI (Gemini), Email, Multer, and JWT Utilities
```

## Diagram shows the full async flow
![Async Flow](./diagram%20shows%20the%20full%20async%20flow.png)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- **Docker & Docker Compose**: Required for database and caching.
- Google Gemini API Key

### Installation & Run

1. **Clone and Install:**
  ```bash
    git clone https://github.com/tareqhasan382/intelligent-api-monitor-backend.git
    cd intelligent-api-monitor-backend
    npm install
  ```
2. **Environment Variables:**
  Create a `.env` file based on `.env.example`. Ensure `GEMINI_API_KEY` is set.

3. **Run Infrastructure (Docker):**
  The system requires MongoDB and Redis. Run them using Docker Compose:
  ```bash
  docker-compose up -d
  ```

4. **Start the Backend:**
  - **Development Mode:**
    ```bash
    npm run start:dev
    ```
  - **Production Mode:**
    ```bash
    npm run build
    npm start
    ```

## 📡 API Endpoints & Input Methods

All API routes are prefixed with `/api/v1`.

### 1. Authentication

- `POST /auth/register` - Create an account.
- `POST /auth/login` - Authenticate and get tokens.

### 2. Monitoring (`POST /monitor`)

The system strictly handles **batch processing**. You MUST provide a raw JSON array or an object-wrapped array.

#### Method A: Raw JSON Array (Strict Root Element)
**Requirement**: The root element must be an ARRAY.

```json
[
  {
    "api_name": "PatientDataAPI",
    "response_time_ms": 1200,
    "status_code": 200,
    "records_returned": 50
  },
  {
    "api_name": "AppointmentAPI",
    "response_time_ms": 5500,
    "status_code": 500,
    "records_returned": 0
  }
]
```



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
npm run start:dev

# Production Build
npm run build
npm start
```

