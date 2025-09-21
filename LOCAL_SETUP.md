# Local Development Setup Guide

## Prerequisites
- **Docker Desktop** - Download from [docker.com](https://www.docker.com/products/docker-desktop)
- **Git** - Download from [git-scm.com](https://git-scm.com/)
- **VS Code** - Download from [code.visualstudio.com](https://code.visualstudio.com/)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/TanmayShigwan1/payroll-management-system.git
   cd payroll-management-system
   ```

2. **Start the application**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Health: http://localhost:8080/api/health

## Services Overview

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Frontend | 3000 | http://localhost:3000 | React.js UI with Nginx |
| Backend | 8080 | http://localhost:8080 | Spring Boot REST API |
| Database | 3306 | localhost:3306 | MySQL 8.0 Database |

## Commands

### Start Services
```bash
docker-compose up -d                    # Start in background
docker-compose up --build -d            # Rebuild and start
```

### Stop Services
```bash
docker-compose down                     # Stop all services
docker-compose down -v                  # Stop and remove volumes
```

### View Logs
```bash
docker-compose logs                     # All services
docker-compose logs frontend           # Frontend only
docker-compose logs backend            # Backend only
docker-compose logs mysql              # Database only
```

### Development
```bash
docker-compose ps                       # Check service status
docker-compose restart backend         # Restart specific service
```

## Database Access

**MySQL Connection:**
- Host: localhost
- Port: 3306
- Database: payroll_db
- Username: root
- Password: rootpassword

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
netstat -tulpn | grep :3000
# Kill the process if needed
sudo kill -9 <PID>
```

### Docker Issues
```bash
# Clean up Docker
docker system prune -f
docker-compose down -v
docker-compose up --build -d
```

### Reset Everything
```bash
# Complete reset
docker-compose down -v
docker system prune -f
docker-compose up --build -d
```

## Features Available

- ✅ Employee Management (CRUD operations)
- ✅ Payroll Processing
- ✅ PaySlip Generation
- ✅ Multi-currency Support
- ✅ Salaried & Hourly Employees
- ✅ Professional Dashboard
- ✅ Responsive Design

## Development Notes

- Frontend built with React 18 and served via Nginx
- Backend uses Spring Boot 3.x with Java 21
- Database automatically initializes with schema
- All services are containerized and orchestrated
- Hot reloading available for development