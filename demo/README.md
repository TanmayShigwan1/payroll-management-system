# Payroll Management System

A modern, full-stack Payroll Management System built with Spring Boot backend and React frontend, designed to streamline payroll processes for organizations of all sizes.

## 🚀 Features

- **Employee Management**
  - Add, edit, and delete employees
  - Support for both salaried and hourly employees
  - Comprehensive employee profiles with contact information

- **Payroll Processing**
  - Automated gross pay calculation based on employee type
  - Tax and benefit deductions management
  - Pay period management and tracking

- **Pay Slip Generation**
  - Detailed pay slips for each employee
  - PDF-ready format for printing
  - Historical pay slip records

- **Dashboard & Analytics**
  - Real-time payroll statistics
  - Employee distribution visualization
  - Recent activity tracking

- **Multi-Currency Support**
  - Support for multiple currencies
  - Real-time currency conversion
  - Localized formatting

## 🏗️ Architecture

### Backend (Spring Boot)
- **Java 21** with Spring Boot 3.5.5
- **JPA/Hibernate** for data persistence
- **MySQL/PostgreSQL** support
- **RESTful API** design
- **Lombok** for reduced boilerplate
- **Validation** with Bean Validation

### Frontend (React)
- **React 18** with functional components
- **React Router** for navigation
- **Bootstrap** for styling
- **Axios** for API communication
- **Chart.js** for data visualization
- **Context API** for state management

## 📁 Project Structure

```
payroll-management-system/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/payroll/system/
│   │   ├── controller/        # REST controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access layer
│   │   ├── model/             # Entity classes
│   │   ├── config/            # Configuration classes
│   │   └── exception/         # Exception handling
│   └── src/main/resources/    # Application properties
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
│   └── public/                # Static assets
├── db-scripts/                # Database scripts
│   ├── db-schema.sql          # Main database schema
│   ├── mysql-schema.sql       # MySQL specific schema
│   └── archive/               # Archived schema files
├── docs/                      # Documentation
```

## 🛠️ Technologies Used

### Backend Stack
- **Java 21** - Latest LTS version for optimal performance
- **Spring Boot 3.5.5** - Modern framework with auto-configuration
- **Spring Data JPA** - Simplified data access layer
- **MySQL/PostgreSQL** - Flexible database support
- **Lombok** - Reduced boilerplate code
- **Maven** - Dependency management and build tool

### Frontend Stack
- **React 18** - Latest React with concurrent features
- **React Router 6** - Client-side routing
- **Bootstrap 5** - Modern, responsive UI framework
- **Axios** - HTTP client for API communication
- **Chart.js** - Interactive data visualization
- **Context API** - State management

### DevOps & Deployment
- **Docker** - Containerization for consistent environments
- **Docker Compose** - Multi-container application management
- **Neon** - Serverless PostgreSQL for production
- **Vercel** - Frontend deployment platform

## 📋 Prerequisites

Ensure you have the following installed:

- **Java 21** or higher
- **Node.js 18** or higher
- **Docker & Docker Compose**
- **Git** for version control

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/TanmayShigwan1/payroll-management-system.git
cd payroll-management-system

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Build the application
mvn clean install

# Run the application
mvn spring-boot:run

# Or run the JAR file
java -jar target/payroll-management-system-0.0.1-SNAPSHOT.jar
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

#### Database Setup

**PostgreSQL (Recommended for Production)**
```bash
# Create database
createdb payroll_db

# Run schema script
psql -d payroll_db -f db-scripts/db-schema.sql
```

**MySQL (Development)**
```bash
# Using Docker
docker-compose up mysql

# The schema will be automatically loaded
```

## 🔧 Configuration

### Backend Configuration

Create `backend/src/main/resources/application-local.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/payroll_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true

# Server Configuration
server.port=8080
```

### Frontend Configuration

Update `frontend/src/config.js`:

```javascript
const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  // Add other configuration options here
};

export default config;
```

## 📊 API Documentation

The REST API provides the following endpoints:

### Employee Management
- `GET /api/employees` - Get all employees
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees/salaried` - Create salaried employee
- `POST /api/employees/hourly` - Create hourly employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Payroll Management
- `GET /api/payroll` - Get all payroll records
- `GET /api/payroll/{id}` - Get payroll by ID
- `POST /api/payroll` - Create payroll record
- `PUT /api/payroll/{id}` - Update payroll record

### Pay Slip Management
- `GET /api/payslips` - Get all pay slips
- `GET /api/payslips/{id}` - Get pay slip by ID
- `GET /api/payslips/employee/{employeeId}` - Get pay slips by employee
- `POST /api/payslips` - Generate pay slip

## 🔒 Security Features

- Input validation with Bean Validation
- CORS configuration for secure cross-origin requests
- Global exception handling
- SQL injection prevention with JPA
- XSS protection in frontend

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📈 Performance Optimizations

- **Database Indexing** - Optimized queries with proper indexes
- **Connection Pooling** - Efficient database connection management
- **Lazy Loading** - Efficient data fetching in React
- **Code Splitting** - Reduced bundle size with dynamic imports
- **Caching** - Browser and application-level caching

## 🌟 Future Enhancements

- [ ] Authentication & Authorization (JWT)
- [ ] Role-based access control
- [ ] Advanced reporting & analytics
- [ ] Email notifications for pay slips
- [ ] Mobile responsive design improvements
- [ ] Audit logging
- [ ] Multi-tenant support
- [ ] Integration with external HR systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tanmay Shigwan**
- GitHub: [@TanmayShigwan1](https://github.com/TanmayShigwan1)
- LinkedIn: [Connect with me](https://linkedin.com/in/tanmayshigwan)

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- React team for the amazing framework
- Bootstrap team for the responsive UI components
- All contributors who helped improve this project

---

**⭐ If you found this project helpful, please give it a star!**

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