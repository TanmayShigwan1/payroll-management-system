#!/bin/bash

echo "🚀 Setting up Payroll Management System..."

# Update system
sudo apt-get update

# Install MySQL client
sudo apt-get install -y mysql-client

# Install global npm packages for development
npm install -g concurrently wait-on

# Setup backend
echo "📦 Setting up Spring Boot backend..."
cd backend

# Create development configuration for H2 database
cat > src/main/resources/application-dev.yml << 'EOF'
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: payroll-management-system
  
  # H2 Database for development
  datasource:
    url: jdbc:h2:mem:payrolldb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
    driverClassName: org.h2.Driver
    username: sa
    password: 
  
  h2:
    console:
      enabled: true
      path: /h2-console
      settings:
        web-allow-others: true
  
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
        format_sql: true
    defer-datasource-initialization: true
  
  sql:
    init:
      mode: always
      data-locations: classpath:data.sql

# JWT Configuration
jwt:
  secret: payrollSecretKey2023ForAuthentication
  expiration: 86400000

# Logging
logging:
  level:
    com.payroll: INFO
    org.springframework.security: INFO
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
EOF

# Create initial data SQL
cat > src/main/resources/data.sql << 'EOF'
-- Insert default users
INSERT INTO users (username, email, password, first_name, last_name, phone_number, user_role, is_active) VALUES
('admin', 'admin@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'System', 'Admin', '9999999999', 'ADMIN', true),
('hr_manager', 'hr@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'HR', 'Manager', '9999999998', 'HR', true),
('john_doe', 'john.doe@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'John', 'Doe', '9999999997', 'EMPLOYEE', true);

-- Insert departments
INSERT INTO departments (name, description) VALUES
('Human Resources', 'Manages employee relations, recruitment, and HR policies'),
('Information Technology', 'Handles software development, system maintenance, and technical support'),
('Finance', 'Manages company finances, accounting, and financial planning'),
('Marketing', 'Handles marketing campaigns, customer relations, and brand management'),
('Sales', 'Manages sales operations and customer acquisition'),
('Operations', 'Handles day-to-day business operations and process management');

-- Insert designations
INSERT INTO designations (title, description) VALUES
('Software Engineer', 'Develops and maintains software applications'),
('Senior Software Engineer', 'Senior level software development and team leadership'),
('HR Manager', 'Manages human resources department and policies'),
('HR Executive', 'Handles HR operations and employee relations'),
('Accountant', 'Manages financial records and accounting operations'),
('Sales Executive', 'Handles sales operations and customer relations'),
('Marketing Manager', 'Manages marketing campaigns and strategies'),
('Team Lead', 'Leads project teams and coordinates development activities'),
('Manager', 'Manages departmental operations and team coordination'),
('Director', 'Senior management role with strategic responsibilities');

-- Insert sample employees
INSERT INTO employees (employee_id, user_id, department_id, designation_id, hire_date, basic_salary) VALUES
('EMP001', 2, 1, 3, '2023-01-15', 75000.00),
('EMP002', 3, 2, 1, '2023-02-01', 60000.00);
EOF

# Build the backend
./mvnw clean compile
echo "✅ Backend setup complete"

# Setup frontend
echo "📦 Setting up React frontend..."
cd ../frontend

# Install dependencies
npm install

# Create environment file
cat > .env << 'EOF'
REACT_APP_API_URL=/api
GENERATE_SOURCEMAP=false
DANGEROUSLY_DISABLE_HOST_CHECK=true
EOF

echo "✅ Frontend setup complete"

# Create startup script
cd ..
cat > start-dev.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Payroll Management System..."

# Start backend
echo "🔄 Starting Spring Boot backend on port 8080..."
cd backend
./mvnw spring-boot:run -Dspring.profiles.active=dev > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 45

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend started successfully"
else
    echo "❌ Backend failed to start. Check backend.log"
    exit 1
fi

# Start frontend
echo "🔄 Starting React frontend on port 3000..."
cd frontend
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "🎉 System started!"
echo ""
echo "📱 Frontend: Check PORTS tab for port 3000"
echo "🔧 Backend API: Port 8080/api"
echo "🗃️ H2 Database Console: Port 8080/api/h2-console"
echo ""
echo "🔐 Login Credentials:"
echo "👤 Admin: admin / secret123"
echo "👤 HR Manager: hr_manager / secret123"
echo "👤 Employee: john_doe / secret123"
echo ""
echo "💡 Tips:"
echo "- Click on port 3000 in the PORTS tab to open the app"
echo "- Make port 3000 public for external access"
echo "- Check logs: tail -f backend.log or frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for processes
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null' EXIT
wait
EOF

chmod +x start-dev.sh

echo "✅ Setup complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Run: ./start-dev.sh"
echo "2. Wait 1-2 minutes for services to start"
echo "3. Check PORTS tab and open port 3000"
echo "4. Login with: admin / secret123"
echo ""
echo "🔗 Manual start:"
echo "Backend: cd backend && ./mvnw spring-boot:run -Dspring.profiles.active=dev"
echo "Frontend: cd frontend && npm start"
echo ""
echo "🚀 Auto-starting the system now..."
echo ""

# Auto-start the system
if [ -f "start-dev.sh" ]; then
    chmod +x start-dev.sh
    echo "Starting services automatically..."
    nohup ./start-dev.sh > startup.log 2>&1 &
    echo "Services starting in background. Check startup.log for details."
else
    echo "Warning: start-dev.sh not found. You'll need to start services manually."
fi
