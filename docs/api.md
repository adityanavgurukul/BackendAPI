# API Documentation

## Authentication API Endpoints

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "User created successfully",
    "userId": "string"
  }
  ```
- **Error Response**: `400 Bad Request`
  ```json
  {
    "message": "All fields are required"
  }
  ```

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Logged in successfully",
    "token": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```
- **Error Response**: `400 Bad Request`
  ```json
  {
    "message": "Email or password is incorrect"
  }
  ```

### Validate Token
- **URL**: `/api/auth/validate`
- **Method**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "isValid": true,
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```
- **Error Response**: `401 Unauthorized`
  ```json
  {
    "message": "Access denied"
  }
  ```

## Products API Endpoints

### Get All Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Success Response**: `200 OK`
  ```json
  {
    "products": [
      {
        "id": "string",
        "title": "string",
        "price": "number",
        "description": "string"
      }
    ]
  }
  ```