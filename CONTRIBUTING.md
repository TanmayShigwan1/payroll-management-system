# Contributing to Payroll Management System

First off, thank you for considering contributing to the Payroll Management System! It's people like you that make this project better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold high standards of respect and professionalism.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find that the problem has already been reported. When you create a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, Java version, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **A clear and descriptive title**
- **A detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **Provide examples of how the feature would work**

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
3. **Make your changes**
4. **Add tests** for your changes
5. **Ensure all tests pass**
6. **Update documentation** if needed
7. **Commit your changes** with a clear commit message
8. **Push to your fork**
9. **Create a Pull Request**

## Development Setup

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- Docker and Docker Compose
- Git

### Local Development
```bash
# Clone your fork
git clone https://github.com/your-username/payroll-management-system.git
cd payroll-management-system

# Start development environment
docker-compose up -d

# Backend development
cd backend
mvn spring-boot:run

# Frontend development (in new terminal)
cd frontend
npm install
npm start
```

### Running Tests

#### Backend Tests
```bash
cd backend
mvn test
```

#### Frontend Tests
```bash
cd frontend
npm test
```

## Style Guidelines

### Java Code Style
- Follow standard Java naming conventions
- Use meaningful variable and method names
- Add JavaDoc comments for public methods
- Keep methods focused and concise
- Use Spring Boot best practices

Example:
```java
/**
 * Calculates the gross pay for an employee based on their type and hours worked.
 * 
 * @param employee The employee to calculate pay for
 * @param hoursWorked The number of hours worked in the pay period
 * @return The calculated gross pay amount
 * @throws IllegalArgumentException if hours worked is negative
 */
public BigDecimal calculateGrossPay(Employee employee, Double hoursWorked) {
    if (hoursWorked < 0) {
        throw new IllegalArgumentException("Hours worked cannot be negative");
    }
    // Implementation...
}
```

### React Code Style
- Use functional components with hooks
- Follow React naming conventions
- Use meaningful component and variable names
- Add PropTypes or TypeScript for type checking
- Keep components focused and reusable

Example:
```jsx
/**
 * Employee form component for creating and editing employees.
 * 
 * @param {Object} props - Component props
 * @param {Employee} props.employee - Employee data for editing (optional)
 * @param {Function} props.onSubmit - Callback function when form is submitted
 * @param {Function} props.onCancel - Callback function when form is cancelled
 */
const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  // Component implementation...
};
```

### Commit Message Format
Use the conventional commits specification:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(employee): add employee search functionality

fix(payroll): resolve calculation error for overtime pay

docs(api): update endpoint documentation

test(employee): add unit tests for employee service
```

## Project Structure

Understanding the project structure will help you navigate and contribute effectively:

```
payroll-management-system/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/payroll/system/
│   │   ├── controller/        # REST controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access
│   │   ├── model/             # Entity classes
│   │   ├── config/            # Configuration
│   │   └── exception/         # Exception handling
│   └── src/test/              # Backend tests
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── contexts/          # React contexts
│   │   └── utils/             # Utility functions
│   └── src/__tests__/         # Frontend tests
├── db-scripts/                # Database scripts
├── docs/                      # Documentation
└── docker-compose.yml         # Development environment
```

## Testing Guidelines

### Backend Testing
- Write unit tests for all service methods
- Use integration tests for controller endpoints
- Mock external dependencies
- Aim for high test coverage

### Frontend Testing
- Test component rendering and behavior
- Test user interactions
- Mock API calls
- Test error states and edge cases

## Documentation

- Update README.md if you change setup instructions
- Update API documentation for new endpoints
- Add inline code comments for complex logic
- Update CHANGELOG.md for notable changes

## Database Changes

If your contribution involves database changes:

1. **Create migration scripts** in `db-scripts/`
2. **Update the main schema** file
3. **Test migrations** on clean database
4. **Update documentation** in `docs/DATABASE.md`
5. **Consider backward compatibility**

## Performance Considerations

- **Backend**: Consider database query performance, use proper indexes
- **Frontend**: Minimize bundle size, use lazy loading for large components
- **Database**: Optimize queries, use appropriate data types
- **General**: Profile your changes to ensure they don't degrade performance

## Security Guidelines

- **Never commit sensitive information** (passwords, API keys, etc.)
- **Validate all inputs** on both frontend and backend
- **Use parameterized queries** to prevent SQL injection
- **Implement proper error handling** without exposing sensitive data
- **Follow security best practices** for your technology stack

## Questions?

If you have questions about contributing, feel free to:

1. **Check existing issues** for similar questions
2. **Create a new issue** with the "question" label
3. **Reach out** to the maintainers

## Recognition

Contributors will be recognized in the project documentation and changelog. We appreciate all contributions, no matter how small!

## License

By contributing to this project, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

Thank you for contributing to the Payroll Management System! 🎉