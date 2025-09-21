# API Documentation

## Overview

The Payroll Management System provides a RESTful API built with Spring Boot. This document outlines all available endpoints, request/response formats, and usage examples.

## Base URL

- **Development**: `http://localhost:8080/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Currently, the API does not require authentication. This will be added in future versions with JWT-based authentication.

## Common Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-09-21T10:30:00.000Z"
}
```

## Employee Management

### Get All Employees

```http
GET /api/employees
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@company.com",
      "phoneNumber": "+1234567890",
      "hireDate": "2025-01-15",
      "address": "123 Main St",
      "employeeType": "SALARIED",
      "annualSalary": 75000.00
    }
  ]
}
```

### Get Employee by ID

```http
GET /api/employees/{id}
```

**Parameters:**
- `id` (path, required): Employee ID

### Create Salaried Employee

```http
POST /api/employees/salaried
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@company.com",
  "phoneNumber": "+1234567891",
  "hireDate": "2025-02-01",
  "address": "456 Oak Ave",
  "annualSalary": 80000.00
}
```

### Create Hourly Employee

```http
POST /api/employees/hourly
```

**Request Body:**
```json
{
  "firstName": "Bob",
  "lastName": "Johnson",
  "email": "bob.johnson@company.com",
  "phoneNumber": "+1234567892",
  "hireDate": "2025-02-15",
  "address": "789 Pine Rd",
  "hourlyRate": 25.00
}
```

### Update Employee

```http
PUT /api/employees/{id}
```

**Parameters:**
- `id` (path, required): Employee ID

**Request Body:** Same as create requests

### Delete Employee

```http
DELETE /api/employees/{id}
```

**Parameters:**
- `id` (path, required): Employee ID

## Payroll Management

### Get All Payroll Records

```http
GET /api/payroll
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee": { ... },
      "payPeriodStart": "2025-09-01",
      "payPeriodEnd": "2025-09-15",
      "grossPay": 3125.00,
      "taxDeductions": 625.00,
      "benefitDeductions": 200.00,
      "netPay": 2300.00,
      "createdAt": "2025-09-16T10:00:00.000Z"
    }
  ]
}
```

### Get Payroll by ID

```http
GET /api/payroll/{id}
```

### Create Payroll Record

```http
POST /api/payroll
```

**Request Body:**
```json
{
  "employeeId": 1,
  "payPeriodStart": "2025-09-01",
  "payPeriodEnd": "2025-09-15",
  "hoursWorked": 80.0,
  "overtimeHours": 5.0,
  "taxDeductions": 625.00,
  "benefitDeductions": 200.00
}
```

### Update Payroll Record

```http
PUT /api/payroll/{id}
```

## Pay Slip Management

### Get All Pay Slips

```http
GET /api/payslips
```

### Get Pay Slip by ID

```http
GET /api/payslips/{id}
```

### Get Pay Slips by Employee

```http
GET /api/payslips/employee/{employeeId}
```

### Generate Pay Slip

```http
POST /api/payslips
```

**Request Body:**
```json
{
  "payrollId": 1,
  "notes": "Regular bi-weekly pay slip"
}
```

## Health Check

### System Health

```http
GET /api/health
```

**Response:**
```json
{
  "status": "UP",
  "database": "UP",
  "timestamp": "2025-09-21T10:30:00.000Z"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 404  | Not Found |
| 500  | Internal Server Error |

## Rate Limiting

Currently, no rate limiting is implemented. This will be added in future versions.

## Pagination

For endpoints that return large datasets, pagination parameters are supported:

- `page`: Page number (0-based, default: 0)
- `size`: Page size (default: 20, max: 100)
- `sort`: Sort criteria (e.g., `firstName,asc`)

Example:
```http
GET /api/employees?page=0&size=10&sort=lastName,asc
```

## Validation Rules

### Employee Validation
- `firstName`: Required, 2-50 characters
- `lastName`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `phoneNumber`: Required, 10-15 characters
- `hireDate`: Required, cannot be in the future
- `annualSalary`: Required for salaried employees, > 0
- `hourlyRate`: Required for hourly employees, > 0

### Payroll Validation
- `payPeriodStart`: Required, must be before end date
- `payPeriodEnd`: Required, must be after start date
- `hoursWorked`: Required for hourly employees, >= 0
- `taxDeductions`: >= 0
- `benefitDeductions`: >= 0

## Sample cURL Commands

### Create a salaried employee:
```bash
curl -X POST http://localhost:8080/api/employees/salaried \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "phoneNumber": "+1234567890",
    "hireDate": "2025-01-15",
    "address": "123 Main St",
    "annualSalary": 75000.00
  }'
```

### Get all employees:
```bash
curl -X GET http://localhost:8080/api/employees
```

### Create payroll record:
```bash
curl -X POST http://localhost:8080/api/payroll \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": 1,
    "payPeriodStart": "2025-09-01",
    "payPeriodEnd": "2025-09-15",
    "hoursWorked": 80.0,
    "taxDeductions": 625.00,
    "benefitDeductions": 200.00
  }'
```