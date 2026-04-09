# Intelligent API Monitoring System - Backend

This is the backend for the Intelligent API Monitoring System, built with Node.js, Express, and MongoDB, following a modular architecture.

## Modular Pattern Overview

The project is structured around a modular pattern to ensure maintainability, scalability, and clear separation of concerns. Each core feature (e.g., `user`, `auth`) resides in its own module, containing related components like controllers, services, models, routes, interfaces, and validation schemas.

```
src/
 ├── modules/
 │    ├── user/
 │    │    ├── user.controller.ts
 │    │    ├── user.service.ts
 │    │    ├── user.model.ts
 │    │    ├── user.route.ts
 │    │    ├── user.interface.ts
 │    │    ├── user.validation.ts
 │    ├── auth/
 │    │    ├── auth.controller.ts
 │    │    ├── auth.service.ts
 │    │    ├── auth.route.ts
 │    │    ├── auth.validation.ts
 │    ├── monitor/
 │    │    ├── monitor.controller.ts
 │    │    ├── monitor.service.ts
 │    │    ├── monitor.route.ts
 │    │
 │    ├── alert/
 │    │    ├── alert.controller.ts
 │    │    ├── alert.service.ts
 │    │    ├── alert.route.ts
 │    │
 ├── middleware/
 │    ├── auth.middleware.ts
 │    ├── validateRequest.ts
 ├── shared/
 │    ├── catchAsync.ts
 │    ├── sendResponse.ts
 ├── utils/
 │    ├── AppError.ts
 │    ├── authUtils.ts
 │    ├── logger.ts
 │
 ├── app.ts
 ├── index.ts
```

## Dependencies

The project utilizes the following key dependencies:

*   `express`: Fast, unopinionated, minimalist web framework for Node.js.
*   `mongoose`: MongoDB object modeling tool.
*   `zod`: TypeScript-first schema declaration and validation library.
*   `jsonwebtoken`: JSON Web Token implementation for Node.js.
*   `bcryptjs`: Library for hashing passwords.
*   `dotenv`: Loads environment variables from a `.env` file.
*   `helmet`: Helps secure Express apps by setting various HTTP headers.
*   `morgan`: HTTP request logger middleware for Node.js.
*   `http-status-codes`: Utility to work with HTTP status codes.
*   `ts-node-dev`: Restarts node on file changes for development.
*   `typescript`: JavaScript with syntax for types.

## Module Details

### Auth Module

Handles user authentication, including registration and login, and manages access and refresh tokens.

*   **Controllers**: [auth.controller.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/modules/auth/auth.controller.ts) - Manages HTTP requests for user registration and login. It uses `catchAsync` for error handling and `sendResponse` for consistent API responses.
*   **Services**: [auth.service.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/modules/auth/auth.service.ts) - Contains the business logic for user authentication, including creating new users, validating credentials, and generating JWT tokens.
*   **Routes**: [auth.route.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/modules/auth/auth.route.ts) - Defines the API endpoints for authentication (`/register`, `/login`) and integrates `validateRequest` middleware for input validation.
*   **Validation**: [auth.validation.ts](file:///d:/Care%HGuide/Intelligent_API_Monitoring_System/backend/src/modules/auth/auth.validation.ts) - Zod schemas for validating registration and login request bodies.

### User Module

Manages user-related operations, such as fetching user profiles and individual user details.

*   **Controllers**: [user.controller.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/modules/user/user.controller.ts) - Handles HTTP requests for fetching user data (`/me`, `/:id`).
*   **Services**: [user.service.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/modules/user/user.service.ts) - Provides methods for retrieving user information from the database.
*   **Model**: [user.model.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/modules/user/user.model.ts) - Mongoose schema and model definition for the `User` entity, including password hashing before saving.
*   **Routes**: [user.route.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/modules/user/user.route.ts) - Defines API endpoints for user-related actions, protected by the `auth` middleware.
*   **Interface**: [user.interface.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/modules/user/user.interface.ts) - TypeScript interfaces for `IUser`, `IUserSafe`, `IUserCreateInput`, `IUserLoginInput`, and `IUserModel`.
*   **Validation**: [user.validation.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/modules/user/user.validation.ts) - Zod schema for validating user ID parameters.

## Middleware & Utilities

### Middleware

*   **`auth.middleware.ts`**: [auth.middleware.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/middleware/auth.middleware.ts) - Express middleware for authenticating requests using JWT tokens. It verifies the token and attaches user information to the request object.
*   **`validateRequest.ts`**: [validateRequest.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/middleware/validateRequest.ts) - Generic middleware for validating incoming request data (body, query, params, cookies) against Zod schemas.

### Utilities

*   **`authUtils.ts`**: [authUtils.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/utils/authUtils.ts) - Centralized utility functions for JWT token creation and verification, and password hashing and comparison using `bcryptjs`.
*   **`catchAsync.ts`**: [catchAsync.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/shared/catchAsync.ts) - A higher-order function to wrap asynchronous Express route handlers, catching any errors and passing them to the global error handler.
*   **`sendResponse.ts`**: [sendResponse.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/shared/sendResponse.ts) - A utility function for sending consistent API responses with status codes, success flags, messages, and data.
*   **`AppError.ts`**: [AppError.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/utils/AppError.ts) - Custom error class for handling operational errors in the application.
*   **`logger.ts`**: [logger.ts](file:///d:/Care%20Guide/Intelligent_API_Monitoring_System/backend/src/utils/logger.ts) - Configures Winston for application logging, with different transports for console and file output.

## API Routes

All API routes are prefixed with `/api/v1`.

### Auth Routes

*   `POST /api/v1/auth/register`: Register a new user.
*   `POST /api/v1/auth/login`: Log in a user and receive access/refresh tokens.

### User Routes

*   `GET /api/v1/users/me`: Get the profile of the authenticated user. (Requires authentication)
*   `GET /api/v1/users/:id`: Get details of a specific user by ID. (Requires authentication)

## Project Setup

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (or yarn)
*   MongoDB instance (local or cloud-hosted)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd Intelligent_API_Monitoring_System/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the `backend` directory based on `.env.example`:

```
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/intelligent-api-monitoring
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

*   `NODE_ENV`: `development`, `production`, or `test`.
*   `PORT`: Port for the Express server.
*   `DATABASE_URL`: MongoDB connection string.
*   `JWT_SECRET`: Secret key for signing access tokens.
*   `JWT_REFRESH_SECRET`: Secret key for signing refresh tokens.
*   `JWT_EXPIRES_IN`: Expiration time for access tokens (e.g., `1h`, `1d`).
*   `JWT_REFRESH_EXPIRES_IN`: Expiration time for refresh tokens.
*   `BCRYPT_SALT_ROUNDS`: Number of salt rounds for bcrypt password hashing.

## Running the Project

### Development Mode

```bash
npm run dev
```

This will start the server using `ts-node-dev`, which automatically restarts the application on file changes.

### Production Build

```bash
npm run build
npm start
```

This compiles the TypeScript code to JavaScript and then starts the application.

## Dummy Data / Testing Guidance

To test the authentication and user management features, you can use tools like Postman or Insomnia.

### Register a User

*   **Endpoint**: `POST http://localhost:5000/api/v1/auth/register`
*   **Body (JSON)**:
    ```json
    {
      "name": "Test User",
      "email": "test@example.com",
      "password": "password123",
      "role": "user"
    }
    ```

### Login a User

*   **Endpoint**: `POST http://localhost:5000/api/v1/auth/login`
*   **Body (JSON)**:
    ```json
    {
      "email": "test@example.com",
      "password": "password123"
    }
    ```
    Upon successful login, you will receive an `accessToken` in the response body and a `refreshToken` in an HTTP-only cookie.

### Get Authenticated User Profile

*   **Endpoint**: `GET http://localhost:5000/api/v1/users/me`
*   **Headers**:
    *   `Authorization`: `Bearer <your_access_token>` (obtained from login)

### Get User by ID

*   **Endpoint**: `GET http://localhost:5000/api/v1/users/<user_id>` (replace `<user_id>` with an actual user ID)
*   **Headers**:
    *   `Authorization`: `Bearer <your_access_token>` (obtained from login)
