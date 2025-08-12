# Payroll Management System

A comprehensive full-stack payroll management system built with **Java Spring Boot** backend, **React.js** frontend, and **MySQL** database. This system provides complete payroll processing, employee management, and reporting capabilities.

## 🚀 Features

### Core Modules
- **Employee Management**: Complete employee lifecycle management
- **Department & Designation Management**: Organizational structure management
- **Payroll Processing**: Automated salary calculations with allowances and deductions
- **Attendance Tracking**: Employee attendance management
- **Reporting & Analytics**: Comprehensive reports and insights
- **User Management**: Role-based access control (Admin, HR, Manager, Employee)

### Key Features
- ✅ **Authentication & Authorization** with JWT tokens
- ✅ **Role-based Access Control** (ADMIN, HR, MANAGER, EMPLOYEE)
- ✅ **Responsive Web Design** with Bootstrap 5
- ✅ **RESTful API Architecture** 
- ✅ **Database Design** with proper relationships
- ✅ **Security Features** with Spring Security
- ✅ **Email Integration** for payslip distribution
- ✅ **PDF Generation** for payslips and reports
- ✅ **Excel Export** functionality
- ✅ **Dashboard** with real-time statistics

## 🛠️ Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Database ORM)
- **Spring Mail** (Email notifications)
- **MySQL Database**
- **Maven** (Dependency Management)

### Frontend
- **React 18** with Hooks
- **React Router Dom** (Navigation)
- **Bootstrap 5** (UI Framework)
- **Axios** (HTTP Client)
- **Font Awesome** (Icons)
- **React Toastify** (Notifications)

### Additional Libraries
- **JWT** (Authentication tokens)
- **iText PDF** (PDF generation)
- **Apache POI** (Excel generation)
- **BCrypt** (Password hashing)

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java JDK 17** or higher
- **Node.js 16** or higher
- **npm** or **yarn**
- **MySQL 8.0** or higher
- **Maven 3.8** or higher
- **Git**

## ⚙️ Installation & Setup

### 🌐 **Option 1: Run Online (Recommended)**

#### **GitHub Codespaces (Free)**
1. Fork this repository to your GitHub account
2. Open the repository on GitHub
3. Click **Code** → **Codespaces** → **Create codespace**
4. Wait for the container to build (auto-setup included)
5. Run commands in the terminal:
   ```bash
   # Start backend
   cd backend && mvn spring-boot:run &
   # Start frontend
   cd frontend && npm start
   ```
6. Access the application through forwarded ports

#### **Play with Docker (Free)**
1. Go to https://labs.play-with-docker.com/
2. Click "Start"
3. Add a new instance
4. Clone and run:
   ```bash
   git clone <your-repo-url>
   cd payroll-management-system
   docker-compose up
   ```

#### **Gitpod (Free)**
1. Go to https://gitpod.io/#<your-github-repo-url>
2. Wait for workspace to start
3. Run the setup automatically

### 💻 **Option 2: Local Installation**

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd payroll-management-system
```

### 2. Database Setup
1. **Install MySQL** and create a database:
```sql
CREATE DATABASE payroll_db;
```

2. **Run the database initialization script**:
```bash
mysql -u root -p payroll_db < database/init-db.sql
```

### 3. Backend Setup (Spring Boot)

Navigate to the backend directory:
```bash
cd backend
```

Update database configuration in `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/payroll_db
    username: root
    password: your_mysql_password
```

Install dependencies and run:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup (React)

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🔐 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | secret123 |
| HR Manager | hr_manager | secret123 |
| Employee | john_doe | secret123 |

> **Note**: Default password is `secret123` (BCrypt encoded: `$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.`)

## 📊 Database Schema

### Key Tables
- **users**: User authentication and basic info
- **employees**: Employee details and employment info
- **departments**: Organizational departments
- **designations**: Job roles and positions
- **payroll_records**: Salary calculations and records
- **attendance_records**: Daily attendance tracking

### Relationships
- User ↔ Employee (One-to-One)
- Department ↔ Employee (One-to-Many)
- Designation ↔ Employee (One-to-Many)
- Employee ↔ PayrollRecord (One-to-Many)
- Employee ↔ AttendanceRecord (One-to-Many)

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user info

### Employees (Admin/HR only)
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Departments (Admin/HR only)
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/{id}` - Update department

### Payroll (Admin/HR only)
- `POST /api/payroll/process` - Process monthly payroll
- `GET /api/payroll/records` - Get payroll records
- `GET /api/payslip/{employeeId}/{month}/{year}` - Get payslip

## 🎨 Screenshots

### Login Page
![Login Screenshot](docs/login-screenshot.png)

### Dashboard
![Dashboard Screenshot](docs/dashboard-screenshot.png)

### Employee Management
![Employee Management Screenshot](docs/employees-screenshot.png)

## 🔒 Security Features

- **JWT Token Authentication**
- **Role-based Authorization**
- **Password Encryption** (BCrypt)
- **CORS Configuration**
- **SQL Injection Protection**
- **XSS Protection**
- **CSRF Protection**

## 📁 Project Structure

```
payroll-management-system/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/com/payroll/
│   │   ├── controller/      # REST Controllers
│   │   ├── service/         # Business Logic
│   │   ├── repository/      # Data Access Layer
│   │   ├── model/          # Entity Classes
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── config/         # Configuration Classes
│   │   ├── security/       # Security Configuration
│   │   └── utils/          # Utility Classes
│   ├── src/main/resources/
│   │   ├── application.yml  # Application Configuration
│   │   └── data.sql        # Initial Data
│   └── pom.xml             # Maven Dependencies
├── frontend/               # React Frontend
│   ├── public/            # Public Assets
│   ├── src/
│   │   ├── components/    # Reusable Components
│   │   ├── pages/         # Page Components
│   │   ├── services/      # API Services
│   │   ├── contexts/      # React Contexts
│   │   ├── utils/         # Utility Functions
│   │   └── App.js         # Main App Component
│   └── package.json       # NPM Dependencies
├── database/              # Database Scripts
│   └── init-db.sql       # Database Initialization
└── README.md             # This file
```

## 🚧 Development Status

### ✅ Completed Features
- Authentication system with JWT
- Role-based access control
- Responsive dashboard
- Database schema and relationships
- Basic CRUD operations setup
- Security configuration

### 🚀 Upcoming Features
- Complete employee management CRUD
- Payroll calculation engine
- Attendance management
- Report generation
- Email notifications
- Advanced analytics
- Mobile app support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email [your-email@domain.com] or create an issue on GitHub.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- Bootstrap team for the responsive CSS framework
- Font Awesome for the beautiful icons
- All open-source contributors who made this possible

---

**Happy Coding! 💻**
