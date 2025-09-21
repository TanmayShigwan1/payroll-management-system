# Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Payroll Management System across different environments and platforms.

## 🎯 Deployment Options

### 1. Local Development
- Docker Compose (Recommended)
- Manual setup

### 2. Cloud Deployment
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Railway, Heroku, or AWS ECS
- **Database**: Neon (PostgreSQL), PlanetScale (MySQL), or AWS RDS

### 3. Enterprise Deployment
- Kubernetes
- Docker Swarm
- Traditional VPS/Dedicated servers

## 🐳 Local Development with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git for cloning the repository

### Quick Start
```bash
# Clone the repository
git clone https://github.com/TanmayShigwan1/payroll-management-system.git
cd payroll-management-system

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Service URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Database**: localhost:3306 (MySQL) or localhost:5432 (PostgreSQL)

## ☁️ Cloud Deployment

### Database Setup (Neon PostgreSQL)

1. **Create Neon Account**
   - Visit https://neon.tech
   - Create a free account
   - Create a new project

2. **Database Configuration**
   ```bash
   # Get your connection string from Neon dashboard
   # Format: postgres://username:password@host/database
   
   # Deploy schema
   cd db-scripts
   export NEON_DB_URL="your_neon_connection_string"
   
   # Linux/macOS
   chmod +x deploy-schema.sh
   ./deploy-schema.sh
   
   # Windows
   deploy-schema.bat
   ```

3. **Environment Variables**
   ```bash
   SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/database
   SPRING_DATASOURCE_USERNAME=your_username
   SPRING_DATASOURCE_PASSWORD=your_password
   ```

### Backend Deployment (Railway)

1. **Setup Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Navigate to backend
   cd backend
   
   # Initialize project
   railway init
   
   # Deploy
   railway up
   ```

2. **Environment Variables in Railway**
   ```bash
   SPRING_PROFILES_ACTIVE=production
   SPRING_DATASOURCE_URL=jdbc:postgresql://[HOST]:[PORT]/[DATABASE]
   SPRING_DATASOURCE_USERNAME=[USERNAME]
   SPRING_DATASOURCE_PASSWORD=[PASSWORD]
   SPRING_JPA_HIBERNATE_DDL_AUTO=validate
   SERVER_PORT=8080
   ```

3. **Custom Start Command**
   ```bash
   java -jar target/payroll-management-system-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment (Vercel)

1. **Setup Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login
   vercel login
   
   # Navigate to frontend
   cd frontend
   
   # Deploy
   vercel
   ```

2. **Environment Variables in Vercel**
   ```bash
   REACT_APP_API_BASE_URL=https://your-railway-app.railway.app/api
   REACT_APP_ENVIRONMENT=production
   ```

3. **Vercel Configuration** (`vercel.json`)
   ```json
   {
     "rewrites": [
       {
         "source": "/((?!api/.*).*)",
         "destination": "/index.html"
       }
     ],
     "headers": [
       {
         "source": "/api/(.*)",
         "headers": [
           {
             "key": "Access-Control-Allow-Origin",
             "value": "*"
           }
         ]
       }
     ]
   }
   ```

## 🔧 Alternative Cloud Platforms

### Backend Alternatives

#### 1. Heroku
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Set environment variables
heroku config:set SPRING_PROFILES_ACTIVE=production
```

#### 2. AWS ECS
```dockerfile
# Dockerfile.production
FROM openjdk:21-jre-slim

WORKDIR /app
COPY target/payroll-management-system-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### Frontend Alternatives

#### 1. Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod --dir=build
```

#### 2. AWS S3 + CloudFront
```bash
# Build project
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🚀 Enterprise Deployment

### Kubernetes Deployment

#### 1. Database (PostgreSQL)
```yaml
# postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_DB
          value: payroll_db
        - name: POSTGRES_USER
          value: payroll_user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

#### 2. Backend Service
```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payroll-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payroll-backend
  template:
    metadata:
      labels:
        app: payroll-backend
    spec:
      containers:
      - name: backend
        image: your-registry/payroll-backend:latest
        env:
        - name: SPRING_DATASOURCE_URL
          value: jdbc:postgresql://postgres-service:5432/payroll_db
        - name: SPRING_DATASOURCE_USERNAME
          value: payroll_user
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: payroll-backend
  ports:
  - port: 8080
    targetPort: 8080
  type: ClusterIP
```

#### 3. Frontend Service
```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payroll-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: payroll-frontend
  template:
    metadata:
      labels:
        app: payroll-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/payroll-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_API_BASE_URL
          value: /api
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: payroll-frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

#### 4. Ingress Configuration
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: payroll-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - payroll.yourdomain.com
    secretName: payroll-tls
  rules:
  - host: payroll.yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

## 🔐 Security Configuration

### SSL/TLS Setup
```bash
# Use Let's Encrypt for free SSL certificates
# Install cert-manager in Kubernetes
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Create ClusterIssuer
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@domain.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

### Environment-Specific Configurations

#### Production
```properties
# application-production.properties
spring.profiles.active=production
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.com.payroll.system=INFO
server.error.include-stacktrace=never
```

#### Staging
```properties
# application-staging.properties
spring.profiles.active=staging
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
logging.level.com.payroll.system=DEBUG
```

## 📊 Monitoring and Observability

### Health Checks
```java
// Custom health indicator
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        try {
            // Check database connectivity
            return Health.up()
                .withDetail("database", "Available")
                .build();
        } catch (Exception e) {
            return Health.down()
                .withDetail("database", "Unavailable")
                .withException(e)
                .build();
        }
    }
}
```

### Logging Configuration
```xml
<!-- logback-spring.xml -->
<configuration>
    <springProfile name="production">
        <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
            <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
                <providers>
                    <timestamp/>
                    <logLevel/>
                    <loggerName/>
                    <message/>
                    <mdc/>
                    <stackTrace/>
                </providers>
            </encoder>
        </appender>
        <root level="INFO">
            <appender-ref ref="STDOUT"/>
        </root>
    </springProfile>
</configuration>
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Run backend tests
        run: |
          cd backend
          mvn test
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Run frontend tests
        run: |
          cd frontend
          npm install
          npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          cd backend
          railway up

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check connection string format
jdbc:postgresql://host:port/database

# Verify credentials
psql -h host -U username -d database

# Check firewall settings
telnet host port
```

#### 2. CORS Issues
```java
// Ensure CORS is properly configured
@CrossOrigin(origins = {"http://localhost:3000", "https://your-frontend-domain.com"})
@RestController
public class EmployeeController {
    // Controller methods
}
```

#### 3. Build Issues
```bash
# Clear Maven cache
mvn clean install -U

# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

#### 1. Database Optimization
```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_payroll_employee_period ON payroll(employee_id, pay_period_start);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM employees WHERE email = 'john@example.com';
```

#### 2. Application Optimization
```java
// Use pagination for large datasets
@GetMapping
public Page<Employee> getAllEmployees(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size) {
    return employeeService.getAllEmployees(PageRequest.of(page, size));
}
```

## 📚 Resources

- [Spring Boot Production Best Practices](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html)
- [React Production Build](https://create-react-app.dev/docs/production-build/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)

---

This deployment guide covers various scenarios from local development to enterprise production deployments. Choose the approach that best fits your infrastructure and requirements.

### Vercel Frontend
- Monitor analytics in the Vercel dashboard
- Check deployment and build logs
- Configure custom domains if needed