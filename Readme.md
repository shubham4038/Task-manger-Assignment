# Task Manager API

This is a backend API for a task manager application. It provides endpoints for user registration, login, task creation, modification, and deletion, as well as functionality to rearrange tasks. The API is built using Node.js and MongoDB, and is hosted on Render.

## API Documentation

For detailed API documentation and testing, please refer to the [Postman Collection](https://www.getpostman.com/collections/cf67a1d76f88a0b0a2a9).

## Technologies Used

- Node.js
- Express
- MongoDB
- Render
- Postman
- Git/Github

## Running the App Locally

1. Clone this repository
2. Install dependencies with `npm install`
3. Start the server with `npm start`

## API Endpoints

### Register a User

POST api/v1/users/signup

Registers a new user with a specified email address and password. An OTP is sent to the specified email address.

### Login

POST api/v1/users/login

Logs in a user with a specified email address and password. Users can only login if they have verified their email address using the OTP sent during registration. A bearer token is generated, which is valid for 5 minutes.

### Verify OTP

PATCH api/v1/users/verifyOTP

Allows users to verify the OTP sent to their email after which they can login to the app.

### Create a Task

POST api/v1/task/createTask

Creates a new task for the currently logged in user. Requires a valid bearer token. Fields include taskName, taskDate, and taskStatus.

### Update a Task

PATCH api/v1/task/updateTask:id

Updates an existing task for the currently logged in user. Requires a valid bearer token. Fields include taskName, taskDate, and taskStatus.

### Get All Tasks

GET api/v1/task/getAllTask

Retrieves all tasks for the currently logged in user. Requires a valid bearer token. Results are paginated.

### Rearrange Tasks

POST api/v1/task/reaArrangeTask

Allows users to rearrange tasks in a specified sequence. The changes made using this endpoint will be reflected in the Get All Tasks endpoint. Requires a valid bearer token.

### Delete a Task

DELETE api/v1/task/deleteTask/:id

Deletes a task with the specified ID for the currently logged in user. Requires a valid bearer token.

## Error Handling

The API returns appropriate error messages for common error scenarios, such as invalid input, authentication failures, and database errors. Error messages are returned in JSON format, with appropriate HTTP status codes.


