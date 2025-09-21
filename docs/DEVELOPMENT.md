# Development Guidelines

## Overview

This document outlines the development guidelines and best practices for contributing to the Payroll Management System.

## Code Style Guidelines

### Java Backend

#### Naming Conventions
- **Classes**: PascalCase (e.g., `EmployeeService`, `PayrollController`)
- **Methods**: camelCase (e.g., `getAllEmployees()`, `calculateGrossPay()`)
- **Variables**: camelCase (e.g., `employeeId`, `grossPay`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_TAX_RATE`, `MAX_OVERTIME_HOURS`)
- **Packages**: lowercase with dots (e.g., `com.payroll.system.service`)

#### Code Organization
- **Controllers**: Handle HTTP requests/responses only
- **Services**: Contain business logic
- **Repositories**: Data access layer
- **Models**: Entity classes with JPA annotations
- **DTOs**: Data transfer objects for API communication

#### Best Practices
```java
// Good: Clear method names and proper documentation
/**
 * Calculates gross pay for an employee based on their type and hours worked.
 * @param employee The employee to calculate pay for
 * @param hoursWorked Hours worked in the pay period
 * @return Calculated gross pay amount
 */
public BigDecimal calculateGrossPay(Employee employee, Double hoursWorked) {
    // Implementation
}

// Good: Use Optional for nullable returns
public Optional<Employee> findEmployeeById(Long id) {
    return employeeRepository.findById(id);
}

// Good: Proper exception handling
@GetMapping("/{id}")
public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
    return employeeService.getEmployeeById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
}
```

### React Frontend

#### Naming Conventions
- **Components**: PascalCase (e.g., `EmployeeForm`, `PaySlipView`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables/Functions**: camelCase (e.g., `handleSubmit`, `employeeData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

#### Component Structure
```jsx
// Good: Functional component with proper structure
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

/**
 * Employee list component displaying all employees with pagination.
 */
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <Container>
      {/* Component JSX */}
    </Container>
  );
};

export default EmployeeList;
```

## Git Workflow

### Branch Naming
- **Feature branches**: `feature/description` (e.g., `feature/employee-crud`)
- **Bug fixes**: `bugfix/description` (e.g., `bugfix/payroll-calculation`)
- **Hotfixes**: `hotfix/description` (e.g., `hotfix/security-patch`)

### Commit Messages
Follow the conventional commits specification:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(employee): add employee creation form validation

fix(payroll): correct gross pay calculation for hourly employees

docs(api): update REST API documentation

style(frontend): format components with prettier

refactor(service): extract common payroll calculations

test(employee): add unit tests for employee service

chore(deps): update spring boot to version 3.5.5
```

### Pull Request Guidelines

1. **Create descriptive PR titles**
   ```
   feat: Add employee management dashboard
   fix: Resolve payroll calculation issues for overtime
   ```

2. **Provide detailed descriptions**
   ```markdown
   ## Description
   Adds a comprehensive employee management dashboard with CRUD operations.

   ## Changes
   - Created EmployeeDashboard component
   - Added employee search and filter functionality
   - Implemented pagination for employee list
   - Added employee detail modal

   ## Testing
   - [x] Unit tests pass
   - [x] Integration tests pass
   - [x] Manual testing completed

   ## Screenshots
   [Include relevant screenshots]
   ```

3. **Ensure code quality**
   - All tests pass
   - Code is properly formatted
   - No console errors or warnings
   - Documentation is updated

## Testing Guidelines

### Backend Testing

#### Unit Tests
```java
@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    @Test
    @DisplayName("Should return all employees")
    void shouldReturnAllEmployees() {
        // Given
        List<Employee> employees = Arrays.asList(
            Employee.builder().firstName("John").lastName("Doe").build(),
            Employee.builder().firstName("Jane").lastName("Smith").build()
        );
        when(employeeRepository.findAll()).thenReturn(employees);

        // When
        List<Employee> result = employeeService.getAllEmployees();

        // Then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getFirstName()).isEqualTo("John");
    }
}
```

#### Integration Tests
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class EmployeeControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("test_db")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldCreateEmployee() {
        // Test implementation
    }
}
```

### Frontend Testing

#### Component Tests
```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeeForm from './EmployeeForm';

describe('EmployeeForm', () => {
  test('should render form fields', () => {
    render(<EmployeeForm />);
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('should validate required fields', async () => {
    render(<EmployeeForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });
});
```

## Database Guidelines

### Schema Design
- Use descriptive table and column names
- Follow snake_case naming convention
- Include proper constraints and indexes
- Add comments for complex relationships

### Migration Scripts
```sql
-- Always include rollback information
-- Migration: Add employee department
-- Rollback: DROP COLUMN department_id FROM employees;

ALTER TABLE employees 
ADD COLUMN department_id BIGINT,
ADD CONSTRAINT fk_employee_department 
    FOREIGN KEY (department_id) REFERENCES departments(id);

CREATE INDEX idx_employee_department ON employees(department_id);
```

## Security Guidelines

### Backend Security
- Validate all input parameters
- Use parameterized queries (JPA handles this)
- Implement proper error handling without exposing sensitive information
- Use HTTPS in production

### Frontend Security
- Sanitize user inputs
- Validate data on both client and server side
- Use secure HTTP headers
- Implement proper CORS configuration

## Performance Guidelines

### Backend Performance
- Use database indexes for frequently queried columns
- Implement pagination for large datasets
- Use connection pooling
- Cache frequently accessed data

### Frontend Performance
- Implement lazy loading for components
- Use React.memo for expensive components
- Optimize bundle size with code splitting
- Implement proper error boundaries

## Documentation Guidelines

### Code Documentation
- Document all public methods and classes
- Include examples for complex functionality
- Keep documentation up to date with code changes
- Use clear and concise language

### API Documentation
- Document all endpoints with examples
- Include request/response schemas
- Specify error codes and messages
- Provide cURL examples

## Environment Setup

### Development Environment
```bash
# Backend
export SPRING_PROFILES_ACTIVE=development
export DATABASE_URL=jdbc:postgresql://localhost:5432/payroll_dev

# Frontend
export REACT_APP_API_BASE_URL=http://localhost:8080/api
export REACT_APP_ENVIRONMENT=development
```

### Production Environment
```bash
# Backend
export SPRING_PROFILES_ACTIVE=production
export DATABASE_URL=${NEON_DATABASE_URL}

# Frontend
export REACT_APP_API_BASE_URL=https://api.yourapp.com
export REACT_APP_ENVIRONMENT=production
```

## Code Review Checklist

### Backend
- [ ] Proper error handling and logging
- [ ] Input validation and sanitization
- [ ] Unit tests for new functionality
- [ ] Database transactions handled correctly
- [ ] Performance considerations addressed

### Frontend
- [ ] Component follows React best practices
- [ ] Proper state management
- [ ] Accessibility considerations
- [ ] Mobile responsiveness
- [ ] Error handling and user feedback

### General
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] No sensitive information exposed
- [ ] Breaking changes are documented
- [ ] Performance impact considered

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Jest Testing Framework](https://jestjs.io/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)

---

These guidelines are living documents and should be updated as the project evolves. All team members are encouraged to contribute improvements and suggestions.