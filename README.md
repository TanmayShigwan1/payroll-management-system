# Payroll Management System

A production-ready payroll platform pairing a Spring Boot 3 backend with a React 18 frontend. It helps finance teams manage employees, automate payroll, generate payslips, and now track departments and time entries end-to-end.

## Key Capabilities

- **Employee & Department Management** – CRUD flows, departmental rollups, and automatic seeding of core departments.
- **Payroll Automation** – Handles salaried and hourly staff, multi-currency gross/net calculations, and audit-ready history.
- **Time Tracking** – Capture, import, approve, and report on employee time entries with status workflows.
- **Payslip Generation** – Create detailed payslips per period with print-friendly formatting and archival search.
- **Dashboards & Reports** – Real-time payroll metrics, department summaries, and export-friendly reports.
- **Configurable Experience** – Currency selector, configurable API base URL, and environment-specific settings for local, demo, and production deployments.

## Architecture Overview

### Backend (Spring Boot)
- Java 21 with Spring Boot 3.5.x
- Spring Data JPA + Hibernate backed by MySQL (development) or Neon/PostgreSQL (production)
- Layered architecture (controller → service → repository → entity)
- DTOs for request/response shaping and validation
- Centralized exception handling and reusable business rules
- Maven-driven build with Docker image support (multi-stage `Dockerfile`)

### Frontend (React)
- React 18 with React Router, Bootstrap 5, and Context API
- Axios-powered data layer with centralized API client (`frontend/src/services/api.js`)
- Feature folders for employees, payroll, payslips, departments, time tracking, reporting, and settings
- Chart.js dashboards and toast notifications for UX feedback

### Supporting Assets
- `db-scripts/` for schema management, SQL utilities, and deployment automation
- `demo/` workspace with guided documentation, demo `docker-compose.yml`, and contribution guides
- `scripts/` utilities for Windows batch helpers and SQL snippets

## Repository Layout

```
payroll-management-system/
├── backend/              # Spring Boot service
│   ├── src/main/java/com/payroll/system/
│   │   ├── config/       # Seeders and configuration beans
│   │   ├── controller/   # REST endpoints (employees, payroll, departments, time entries)
│   │   ├── dto/          # Request/response payloads
│   │   ├── model/        # JPA entities and enums
│   │   ├── repository/   # Spring Data repositories
│   │   └── service/      # Interfaces and implementations
│   └── src/main/resources/ # Property files per environment
├── frontend/             # React SPA
│   ├── src/components/   # Feature-driven UI modules
│   ├── src/contexts/     # React context providers
│   ├── src/services/     # API client
│   └── public/           # Static assets
├── db-scripts/           # SQL schema, change log, deployment scripts
├── demo/                 # Documentation bundle & docker demo stack
├── docs/                 # Extended API and operations documentation
└── scripts/              # Helper scripts (Windows & Bash)
```

## Quick Start

### 1. Run the full stack with Docker

```bash
git clone https://github.com/TanmayShigwan1/payroll-management-system.git
cd payroll-management-system
docker compose -f demo/docker-compose.yml up --build
```

> ℹ️ Run the command from the repository root so the compose file can mount `db-scripts/mysql-schema.sql` correctly. The stack exposes the frontend at <http://localhost:3000> and the backend API at <http://localhost:8080/api>.

### 2. Manual Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend listens on `http://localhost:8080`. Update `src/main/resources/application.properties` to point at your preferred database (MySQL or PostgreSQL/Neon). Sample overrides live in `application-neon.properties`.

### 3. Manual Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React dev server proxies API calls to `http://localhost:8080` via the `proxy` entry in `package.json`. Override by exporting `REACT_APP_API_URL` if the backend runs elsewhere.

### 4. Database Options

- **MySQL (local)** – Use the Docker compose stack or run `mysql-schema.sql` in your own instance.
- **PostgreSQL / Neon** – Review `docs/DEPLOYMENT.md` and `db-scripts/deploy-schema.sh` for automated provisioning.
- **Seed Data** – `DepartmentDataSeeder` populates default departments on startup; adjust or disable in the configuration package if needed.

## Configuration

| Area | File / Setting | Notes |
|------|----------------|-------|
| Backend datasource | `backend/src/main/resources/application.properties` | Configure JDBC URL, credentials, and `spring.profiles.active`.
| Neon profile | `application-neon.properties` | Enabled via `SPRING_PROFILES_ACTIVE=neon`.
| Frontend API URL | `frontend/src/config.js` or `REACT_APP_API_URL` | Defaults to `http://localhost:8080/api`.
| Currency defaults | `frontend/src/contexts/CurrencyContext.js` | Controls currency symbol and formatting.

## Testing & Quality Gates

```bash
cd backend
mvn test

cd ../frontend
npm test
```

The backend uses JUnit + Mockito; frontend tests are powered by React Testing Library. Generated reports land in `backend/target/surefire-reports/`.

## API Surface

- `docs/API.md` – End-to-end REST reference
- `docs/backend-status.html` – Health check dashboard (open in a browser)
- Department summaries: `GET /api/departments/{id}/summary?start=YYYY-MM-DD&end=YYYY-MM-DD`
- Time entry workflow: `POST /api/time-entries`, bulk import, approval via `PUT /api/time-entries/{id}/status`

## Additional Resources

- `demo/README.md` – curated walkthrough for demos and workshops
- `demo/LOCAL_SETUP.md` – guided local setup for non-developers
- `docs/DEVELOPMENT.md` – coding standards and branching strategy
- `docs/DEPLOYMENT.md` – production deployment checklists

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/awesome-improvement`
3. Commit your work: `git commit -m "feat: describe your change"`
4. Push the branch: `git push origin feature/awesome-improvement`
5. Open a pull request and link any related issues

Please read `CONTRIBUTING.md` for coding standards, commit message conventions, and review expectations.

## License

This project is released under the MIT License. See [`LICENSE`](LICENSE) for full text.

---

Need a hand or want to report an issue? Open a ticket or reach out via the repository discussions. Happy payrolling!
