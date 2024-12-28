# Exercise API Documentation

## Base URL
```
/api/exercise
```

## Authentication
All endpoints require JWT authentication.

---

## Endpoints

### 1. Get All Exercises
- **Method**: `GET`
- **URL**: `/api/exercise`
- **Description**: Retrieves a list of all exercises.
- **Response**:
  - **200 OK**: Returns an array of exercises with details of the user who created each exercise.
  - **500 Internal Server Error**: If there is an error fetching exercises.

---

### 2. Get Exercise by ID
- **Method**: `GET`
- **URL**: `/api/exercise/:id`
- **Description**: Retrieves a specific exercise by its ID.
- **Parameters**:
  - `id` (integer): The ID of the exercise to retrieve.
- **Response**:
  - **200 OK**: Returns the exercise details.
  - **404 Not Found**: If the exercise is not found.
  - **500 Internal Server Error**: If there is an error fetching the exercise.

---

### 3. Create New Exercise
- **Method**: `POST`
- **URL**: `/api/exercise`
- **Description**: Creates a new exercise.
- **Request Body**:
  - `name` (string, required): The name of the exercise.
  - `description` (string, optional): A description of the exercise.
  - **Example**:
    ```json
    {
      "name": "Push Up",
      "description": "A basic exercise for upper body strength."
    }
    ```
- **Response**:
  - **201 Created**: Returns the created exercise details.
  - **400 Bad Request**: If the exercise name is not provided.
  - **500 Internal Server Error**: If there is an error creating the exercise.

---

### 4. Update Exercise
- **Method**: `PUT`
- **URL**: `/api/exercise/:id`
- **Description**: Updates an existing exercise.
- **Parameters**:
  - `id` (integer): The ID of the exercise to update.
- **Request Body**:
  - `name` (string, required): The updated name of the exercise.
  - `description` (string, optional): The updated description of the exercise.
  - **Example**:
    ```json
    {
      "name": "Push Up Updated",
      "description": "An updated description for the exercise."
    }
    ```
- **Response**:
  - **200 OK**: Returns the updated exercise details.
  - **400 Bad Request**: If the exercise name is not provided.
  - **403 Forbidden**: If the user is not authorized to update this exercise.
  - **404 Not Found**: If the exercise is not found.
  - **500 Internal Server Error**: If there is an error updating the exercise.

---

### 5. Delete Exercise
- **Method**: `DELETE`
- **URL**: `/api/exercise/:id`
- **Description**: Deletes a specific exercise.
- **Parameters**:
  - `id` (integer): The ID of the exercise to delete.
- **Request Body**:
  - **Example**:
    ```json
    {
      "id": 1
    }
    ```
- **Response**:
  - **200 OK**: Returns a success message.
  - **403 Forbidden**: If the user is not authorized to delete this exercise.
  - **404 Not Found**: If the exercise is not found.
  - **400 Bad Request**: If the exercise is being used in routines.
  - **500 Internal Server Error**: If there is an error deleting the exercise.

---

### Error Handling
All endpoints include error handling to return appropriate status codes and messages for various error scenarios.
