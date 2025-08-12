# 🚀 GitHub Codespaces Deployment Instructions

## ✅ **AUTOMATIC SETUP** (Recommended)

### Step 1: Open in Codespaces
1. Go to: **https://github.com/TanmayShigwan1/payroll-management-system**
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. Wait 3-5 minutes for automatic setup

### Step 2: Check Setup Progress
- Watch the terminal for setup progress
- You'll see: Installing Java, Node.js, dependencies
- Setup completes with "✅ Setup complete!"

### Step 3: Start the System
```bash
./start-dev.sh
```

### Step 4: Access Your Live App
1. Go to **PORTS** tab (bottom of VS Code)
2. Click on port **3000** 
3. Make it **Public** for sharing
4. Your payroll system is now LIVE! 🎉

---

## 🔧 **MANUAL SETUP** (If automatic fails)

### Step 1: Create Development Configuration
```bash
# Backend development config
cat > backend/src/main/resources/application-dev.yml << 'EOF'
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:h2:mem:payrolldb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
    driverClassName: org.h2.Driver
    username: sa
    password: 
  
  h2:
    console:
      enabled: true
      path: /h2-console
  
  jpa:
    hibernate:
      ddl-auto: create-drop
    defer-datasource-initialization: true
  
  sql:
    init:
      mode: always

jwt:
  secret: payrollSecretKey2023ForAuthentication
  expiration: 86400000
EOF
```

### Step 2: Create Initial Data
```bash
# Database initialization
cat > backend/src/main/resources/data.sql << 'EOF'
INSERT INTO users (username, email, password, first_name, last_name, phone_number, user_role, is_active) VALUES
('admin', 'admin@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'System', 'Admin', '9999999999', 'ADMIN', true),
('hr_manager', 'hr@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'HR', 'Manager', '9999999998', 'HR', true),
('john_doe', 'john.doe@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'John', 'Doe', '9999999997', 'EMPLOYEE', true);

INSERT INTO departments (name, description) VALUES
('Human Resources', 'HR Department'),
('Information Technology', 'IT Department'),
('Finance', 'Finance Department');

INSERT INTO designations (title, description) VALUES
('HR Manager', 'HR Management Role'),
('Software Engineer', 'Software Development Role'),
('Accountant', 'Finance Role');

INSERT INTO employees (employee_id, user_id, department_id, designation_id, hire_date, basic_salary) VALUES
('EMP001', 2, 1, 1, '2023-01-15', 75000.00),
('EMP002', 3, 2, 2, '2023-02-01', 60000.00);
EOF
```

### Step 3: Setup Frontend
```bash
cd frontend
npm install

# Create environment file
cat > .env << 'EOF'
REACT_APP_API_URL=/api
DANGEROUSLY_DISABLE_HOST_CHECK=true
HOST=0.0.0.0
PORT=3000
EOF

cd ..
```

### Step 4: Start Services Manually

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## 🔐 **LOGIN CREDENTIALS**

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `secret123` |
| **HR Manager** | `hr_manager` | `secret123` |
| **Employee** | `john_doe` | `secret123` |

---

## 📊 **WHAT YOU'LL SEE**

### ✅ **Admin Dashboard (`admin` / `secret123`)**
- Employee statistics and overview
- Complete employee management (Add, Edit, Delete)
- Department and designation management
- Payroll processing capabilities
- System-wide reports and analytics
- User role management

### ✅ **HR Manager Dashboard (`hr_manager` / `secret123`)**
- Employee management functions
- Payroll processing for departments
- HR-specific reports
- Department statistics

### ✅ **Employee Portal (`john_doe` / `secret123`)**
- Personal dashboard with employee info
- Access to personal payslips
- Profile management
- Attendance tracking

---

## 🚨 **TROUBLESHOOTING**

### Backend Won't Start:
```bash
# Check Java version
java -version

# Check port 8080 is free
netstat -an | grep 8080

# Restart backend
cd backend
./mvnw clean spring-boot:run -Dspring.profiles.active=dev
```

### Frontend Won't Load:
```bash
# Check Node version
node -v

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install
npm start
```

### Login Issues:
- Use exact credentials: `admin` / `secret123`
- Check backend logs: `tail -f backend.log`
- Verify database initialized: Access H2 console at port 8080/api/h2-console

### Port Issues:
- Go to PORTS tab in VS Code
- Make ports public for external access
- Check port forwarding is working

---

## 🎯 **QUICK COMMANDS**

```bash
# Check if services are running
ps aux | grep java
ps aux | grep node

# View logs
tail -f backend.log
tail -f frontend.log

# Test backend API
curl http://localhost:8080/api/auth/signin \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret123"}'

# Access database console
# Go to: http://localhost:8080/api/h2-console
# JDBC URL: jdbc:h2:mem:payrolldb
# Username: sa
# Password: (empty)
```

---

## 🌟 **SUCCESS INDICATORS**

✅ **Backend Started:** See "Started PayrollManagementSystemApplication" in logs
✅ **Frontend Started:** See "webpack compiled" and port 3000 available
✅ **Database Ready:** Can access H2 console with sample data
✅ **Login Works:** Can login with admin/secret123
✅ **UI Loads:** Professional dashboard with navigation

---

## 🚀 **SHARING YOUR DEMO**

1. **Make ports public** in PORTS tab
2. **Copy the external URL** for port 3000
3. **Share with anyone** - no account needed
4. **Demo credentials:** admin / secret123

Example URL: `https://legendary-space-giggle-xyz.github.dev`

---

**🎉 Congratulations! You now have a fully functional payroll management system running live in the cloud!**
