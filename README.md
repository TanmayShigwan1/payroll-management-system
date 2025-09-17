# Payroll Management System

A modern full-stack Payroll Management System built with Spring Boot (backend) and React (frontend).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

## Overview

This Payroll Management System is designed to streamline and automate the payroll process in an organization. It handles both salaried and hourly employees, calculates payroll with proper tax deductions, and generates detailed pay slips.

## Features

- **Employee Management**
  - Add, edit, and delete employees
  - Support for both salaried and hourly employees
  - Store employee personal and payment information

- **Payroll Processing**
  - Calculate gross pay based on employee type
  - Apply appropriate tax and benefit deductions
  - Generate payroll records for each pay period

- **Pay Slip Generation**
  - Create detailed pay slips for each employee
  - Print-friendly pay slip format
  - Historical pay slip record keeping

- **Dashboard & Reporting**
  - Overview of payroll statistics
  - Employee distribution visualization
  - Recent payroll activity tracking

## Project Structure

```
payroll-management-system/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/payroll/system/
│   │   │   │   ├── config/     # Configuration classes
│   │   │   │   ├── controller/ # REST controllers
│   │   │   │   ├── exception/  # Exception handling
│   │   │   │   ├── model/      # JPA entities
│   │   │   │   ├── repository/ # JPA repositories
│   │   │   │   └── service/    # Business logic
│   │   │   └── resources/      # Application properties
│   │   └── test/               # Unit and integration tests
│   └── pom.xml                 # Maven dependencies
│
├── frontend/                   # React frontend
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── common/         # Reusable components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── employee/       # Employee management
│   │   │   ├── payroll/        # Payroll processing
│   │   │   └── payslip/        # Pay slip generation
│   │   ├── services/           # API services
│   │   ├── App.js              # Main App component
│   │   └── index.js            # Entry point
│   └── package.json            # npm dependencies
│
└── db-scripts/                 # Database scripts
    └── db-schema.sql           # PostgreSQL schema creation script
    └── deploy-schema.bat       # Deployment script for Neon
```

## Technologies Used

### Backend

- **Java 11**
- **Spring Boot 2.7.13**
- **Spring Data JPA**
- **PostgreSQL**
- **Neon (PostgreSQL Service for Production)**
- **Maven**
- **Lombok**
- **JUnit & Mockito** (for testing)

### Frontend

- **React 18**
- **React Router 6**
- **React Bootstrap**
- **Axios**
- **Chart.js**
- **Formik & Yup** (for form validation)
- **React Toastify** (for notifications)
- **Vercel** (for deployment)

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Java Development Kit (JDK) 11** or higher
- **Node.js 14** or higher
- **npm 6** or higher
- **PostgreSQL 12** or higher
- **Maven 3.6** or higher

## Setup Instructions

### Database Setup

#### Local Development (PostgreSQL)

1. Ensure PostgreSQL server is running.

2. Create the database and tables by running the script:

   ```bash
   psql -U postgres -d payroll_db -f db-scripts/db-schema.sql
   ```

   Alternatively, you can use a PostgreSQL client like pgAdmin to run the script.

3. The script will:
   - Set up all necessary tables
   - Create triggers and functions for auditing
   - Create sample data for testing

#### Production Deployment (Neon PostgreSQL)

1. Set the Neon database connection string as an environment variable:

   ```bash
   # Windows
   set NEON_DB_URL=postgres://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   
   # Linux/macOS
   export NEON_DB_URL=postgres://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   ```

2. Run the deployment script:

   ```bash
   # Windows
   cd db-scripts
   deploy-schema.bat
   
   # Linux/macOS
   cd db-scripts
   ./deploy-schema.sh
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd payroll-management-system/backend
   ```

2. Update database configuration in `src/main/resources/application.properties` if needed:

   ```properties
   # For local PostgreSQL
   spring.datasource.url=jdbc:postgresql://localhost:5432/payroll_db
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   
   # For Neon PostgreSQL (production)
   # spring.profiles.active=neon
   ```

   Change the username and password to match your PostgreSQL credentials.
   For production, set `spring.profiles.active=neon` to use Neon PostgreSQL.

3. Build and run the Spring Boot application:

   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. The backend will start at `http://localhost:8080/api`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd payroll-management-system/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. The frontend will start at `http://localhost:3000`

5. The frontend is configured to proxy API requests to the backend at `http://localhost:8080/api` (defined in `package.json`).

## Usage Guide

### Employee Management

1. **View Employees**: Navigate to the "Employees" section from the sidebar to see a list of all employees.
2. **Add Employee**: Click the "Add New Employee" button on the Employees page to add a new employee.
3. **Edit Employee**: Click the edit icon next to an employee to update their information.
4. **Delete Employee**: Click the delete icon next to an employee to remove them from the system.

### Payroll Processing

1. **Process Payroll**: Navigate to the "Payroll Processing" section from the sidebar.
2. **Select Employee**: Choose an employee from the dropdown menu.
3. **Set Pay Period**: Define the start and end dates for the pay period.
4. **Calculate Pay**: Click the "Process Payroll" button to calculate the employee's pay with deductions.
5. **Generate Pay Slip**: After processing, click "Generate Pay Slip" to create a formal pay slip.

### Pay Slip Viewing

1. **View All Pay Slips**: Navigate to the "Pay Slips" section from the sidebar to see all generated pay slips.
2. **Filter Pay Slips**: Use the search and filter options to find specific pay slips.
3. **View Pay Slip Details**: Click the view icon next to a pay slip to see detailed information.
4. **Print Pay Slip**: Use the print button to generate a printer-friendly version of the pay slip.

### Dashboard

1. Navigate to the "Dashboard" section (home page) to see an overview of:
   - Total number of employees
   - Distribution of employee types
   - Monthly payroll totals
   - Recent payroll activities

## API Documentation

### Employee Endpoints

- `GET /api/employees` - Get all employees
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/{id}` - Update an employee
- `DELETE /api/employees/{id}` - Delete an employee

### Payroll Endpoints

- `POST /api/payroll/calculate` - Process payroll for an employee
- `GET /api/payroll/employee/{employeeId}` - Get payroll history for an employee
- `GET /api/payroll` - Get all payrolls (with optional date filters)

### PaySlip Endpoints

- `POST /api/payslips/generate/{payrollId}` - Generate a pay slip for a processed payroll
- `GET /api/payslips` - Get all pay slips
- `GET /api/payslips/{id}` - Get pay slip by ID
- `GET /api/payslips/employee/{employeeId}` - Get pay slips for an employee

## Future Enhancements

- **User Authentication & Role-based Access Control**
- **Tax Rule Management**
- **Benefits Management**
- **Leave Management Integration**
- **Multi-currency Support**
- **Email Notifications**
- **Mobile App for Employees**
- **Advanced Reporting**

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2025 Payroll Management System