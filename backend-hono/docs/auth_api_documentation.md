# Authentication API Documentation

## Base URL
```
/api/auth
```

---

## Endpoints

### 1. User Login
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:
  - `email` (string, required): The user's email address.
  - `password` (string, required): The user's password.
- **Example**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  - **200 OK**: Returns the user data and JWT token.
  - **400 Bad Request**: If email or password is missing.
  - **401 Unauthorized**: If credentials are invalid.
  - **500 Internal Server Error**: If there is an error during login.

---

### 2. User Registration
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Description**: Registers a new user and returns a JWT token.
- **Request Body**:
  - `email` (string, required): The user's email address.
  - `password` (string, required): The user's password.
  - `name` (string, optional): The user's name.
- **Example**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "securepassword",
    "name": "New User"
  }
  ```
- **Response**:
  - **201 Created**: Returns the user data and JWT token.
  - **400 Bad Request**: If email or password is missing or if the email is already registered.
  - **500 Internal Server Error**: If there is an error during registration.

---

### Error Handling
All endpoints include error handling to return appropriate status codes and messages for various error scenarios.

---
