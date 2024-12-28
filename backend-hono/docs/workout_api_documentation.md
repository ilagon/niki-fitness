# Workout API Documentation

## Base URL
```
/api/workout
```

## Authentication
All endpoints require JWT authentication.

---

## Endpoints

### 1. Get All Workouts
- **Method**: `GET`
- **URL**: `/api/workout`
- **Description**: Retrieves a list of all workouts created by the authenticated user.
- **Response**:
  - **200 OK**: Returns an array of workouts.
  - **500 Internal Server Error**: If there is an error fetching workouts.

---

### 2. Get Workout by ID
- **Method**: `GET`
- **URL**: `/api/workout/:id`
- **Description**: Retrieves a specific workout by its ID, only if the user created it.
- **Parameters**:
  - `id` (integer): The ID of the workout to retrieve.
- **Response**:
  - **200 OK**: Returns the workout details.
  - **404 Not Found**: If the workout is not found or the user is unauthorized.
  - **500 Internal Server Error**: If there is an error fetching the workout.

---

### 3. Create New Workout
- **Method**: `POST`
- **URL**: `/api/workout`
- **Description**: Creates a new workout.
- **Request Body**:
  - `name` (string, required): The name of the workout.
  - `description` (string, optional): A description of the workout.
  - `exercises` (array of integers, required): An array of exercise IDs to include in the workout.
  - **Example**:
    ```json
    {
      "name": "Morning Workout",
      "description": "A great way to start the day.",
      "exercises": [1, 2, 3]
    }
    ```
- **Response**:
  - **201 Created**: Returns the created workout details.
  - **500 Internal Server Error**: If there is an error creating the workout.

---

### 4. Update Workout
- **Method**: `PUT`
- **URL**: `/api/workout/:id`
- **Description**: Updates an existing workout.
- **Parameters**:
  - `id` (integer): The ID of the workout to update.
- **Request Body**:
  - `name` (string, required): The updated name of the workout.
  - `description` (string, optional): The updated description of the workout.
  - `exercises` (array of integers, required): An array of exercise IDs to include in the workout.
  - **Example**:
    ```json
    {
      "name": "Updated Morning Workout",
      "description": "An updated description for the workout.",
      "exercises": [1, 2]
    }
    ```
- **Response**:
  - **200 OK**: Returns the updated workout details.
  - **404 Not Found**: If the workout is not found or the user is unauthorized.
  - **500 Internal Server Error**: If there is an error updating the workout.

---

### 5. Delete Workout
- **Method**: `DELETE`
- **URL**: `/api/workout/:id`
- **Description**: Deletes a specific workout.
- **Parameters**:
  - `id` (integer): The ID of the workout to delete.
- **Example**:
  ```json
  {
    "id": 1
  }
  ```
- **Response**:
  - **200 OK**: Returns a success message.
  - **404 Not Found**: If the workout is not found or the user is unauthorized.
  - **500 Internal Server Error**: If there is an error deleting the workout.

---

### Error Handling
All endpoints include error handling to return appropriate status codes and messages for various error scenarios.
