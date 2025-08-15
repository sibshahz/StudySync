# Semester Management API

This document describes the semester management system that allows you to create and manage semesters for batches within departments.

## Overview

The semester management system provides the following functionality:
- Create and manage semesters (FALL, SPRING)
- Enroll entire batches into semesters
- View semester enrollment for batches
- CRUD operations for semesters

## API Endpoints

All endpoints require authentication and appropriate role-based authorization.

### Base URL: `/api/semesters`

---

## Semester CRUD Operations

### 1. Get All Available Semesters
**GET** `/api/semesters/available`

Returns all semesters in the system, not tied to any specific batch.

**Permissions:** STUDENT, TEACHER, ADMIN

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Fall 2024",
      "semesterSeason": "FALL",
      "startDate": "2024-09-01T00:00:00.000Z",
      "endDate": "2024-12-15T00:00:00.000Z",
      "createdAt": "2024-08-15T09:00:00.000Z",
      "updatedAt": "2024-08-15T09:00:00.000Z",
      "_count": {
        "students": 45,
        "courses": 12
      }
    }
  ]
}
```

### 2. Get Single Semester
**GET** `/api/semesters/:semesterId`

Returns detailed information about a specific semester.

**Permissions:** STUDENT, TEACHER, ADMIN

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Fall 2024",
    "semesterSeason": "FALL",
    "startDate": "2024-09-01T00:00:00.000Z",
    "endDate": "2024-12-15T00:00:00.000Z",
    "createdAt": "2024-08-15T09:00:00.000Z",
    "updatedAt": "2024-08-15T09:00:00.000Z",
    "students": [
      {
        "id": 1,
        "name": "John Doe",
        "rollNo": "CS2022-001",
        "email": "john@example.com",
        "batch": {
          "id": 1,
          "name": "BSCS 2022",
          "batchCode": "CS22"
        }
      }
    ],
    "courses": [
      {
        "id": 1,
        "name": "Data Structures",
        "code": "CS201"
      }
    ]
  }
}
```

### 3. Create New Semester
**POST** `/api/semesters`

Creates a new semester.

**Permissions:** TEACHER, ADMIN

**Request Body:**
```json
{
  "name": "Spring 2025",
  "semesterSeason": "SPRING",
  "startDate": "2025-01-15",
  "endDate": "2025-05-30"
}
```

**Validation Rules:**
- `name`: String, 2-100 characters
- `semesterSeason`: Enum ("SPRING" | "FALL")
- `startDate`: Date, must be today or in the future
- `endDate`: Date, must be after startDate

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Spring 2025",
    "semesterSeason": "SPRING",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-05-30T00:00:00.000Z",
    "createdAt": "2024-08-15T09:30:00.000Z",
    "updatedAt": "2024-08-15T09:30:00.000Z"
  }
}
```

### 4. Update Semester
**PUT** `/api/semesters/:semesterId`

Updates an existing semester.

**Permissions:** TEACHER, ADMIN

**Request Body:** Same as create semester

**Response:** Same structure as create semester

### 5. Delete Semester
**DELETE** `/api/semesters/:semesterId`

Deletes a semester.

**Permissions:** TEACHER, ADMIN

**Response:**
```json
{
  "success": true,
  "message": "Semester deleted successfully",
  "data": {
    "id": 2,
    "name": "Spring 2025",
    // ... other semester fields
  }
}
```

---

## Batch-Semester Management

### 6. Get Semesters for Batch
**GET** `/api/semesters/batch/:batchId`

Returns all semesters that have students from the specified batch enrolled.

**Permissions:** STUDENT, TEACHER, ADMIN

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Fall 2024",
      "semesterSeason": "FALL",
      "startDate": "2024-09-01T00:00:00.000Z",
      "endDate": "2024-12-15T00:00:00.000Z",
      "students": [
        {
          "id": 1,
          "name": "John Doe",
          "rollNo": "CS2022-001"
        }
      ],
      "courses": [
        {
          "id": 1,
          "name": "Data Structures",
          "code": "CS201"
        }
      ],
      "_count": {
        "students": 25,
        "courses": 6
      }
    }
  ]
}
```

### 7. Get Batch Semester Enrollment
**GET** `/api/semesters/batch/:batchId/enrollment`

Returns detailed enrollment information for a batch.

**Permissions:** STUDENT, TEACHER, ADMIN

**Response:**
```json
{
  "success": true,
  "data": {
    "batch": {
      "id": 1,
      "name": "BSCS 2022",
      "batchCode": "CS22",
      "studentCount": 25
    },
    "enrolledSemesters": [
      {
        "id": 1,
        "name": "Fall 2024",
        "semesterSeason": "FALL",
        "startDate": "2024-09-01T00:00:00.000Z",
        "endDate": "2024-12-15T00:00:00.000Z"
      }
    ]
  }
}
```

### 8. Enroll Batch in Semester
**POST** `/api/semesters/batch/:batchId/enroll/:semesterId`

Enrolls all students from a batch into a semester.

**Permissions:** TEACHER, ADMIN

**Response:**
```json
{
  "success": true,
  "message": "Batch enrolled in semester successfully",
  "data": {
    "id": 1,
    "name": "Fall 2024",
    "students": [
      // All students from the batch
    ]
  }
}
```

### 9. Unenroll Batch from Semester
**DELETE** `/api/semesters/batch/:batchId/unenroll/:semesterId`

Removes all students from a batch from a semester.

**Permissions:** TEACHER, ADMIN

**Response:**
```json
{
  "success": true,
  "message": "Batch unenrolled from semester successfully",
  "data": {
    "id": 1,
    "name": "Fall 2024"
  }
}
```

---

## Usage Examples

### Creating a new semester and enrolling a batch:

1. **Create semester:**
```bash
POST /api/semesters
{
  "name": "Fall 2024",
  "semesterSeason": "FALL",
  "startDate": "2024-09-01",
  "endDate": "2024-12-15"
}
```

2. **Enroll batch in semester:**
```bash
POST /api/semesters/batch/1/enroll/1
```

3. **Check enrollment:**
```bash
GET /api/semesters/batch/1/enrollment
```

### Viewing batch semesters:
```bash
GET /api/semesters/batch/1
```

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

---

## Database Schema

The semester system uses the existing database schema with many-to-many relationships:

- **Semester** ↔ **Student** (many-to-many)
- **Student** → **Batch** (many-to-one)
- **Batch** → **Department** (many-to-one)

This allows flexible enrollment where:
- Students from different batches can be in the same semester
- Students from the same batch can be in different semesters
- Batch-level operations enroll/unenroll all students in a batch at once
