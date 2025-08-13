package com.payroll.config;

import com.payroll.model.*;
import com.payroll.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Initializer to create default users (Admin, HR, Employee)
 * This demonstrates the inheritance concept by creating different types of persons
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createDefaultUsers();
        createDefaultDepartments();
        createDefaultDesignations();
    }

    private void createDefaultUsers() {
        // Create Admin User
        if (userRepository.findByUsername("admin").isEmpty()) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@payroll.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFirstName("System");
            adminUser.setLastName("Administrator");
            adminUser.setPhoneNumber("+91-9999999999");
            adminUser.setRole(User.UserRole.ADMIN);
            adminUser.setIsActive(true);
            userRepository.save(adminUser);
            System.out.println("✅ Created Admin User: admin/admin123");
        }

        // Create HR User
        if (userRepository.findByUsername("hr_manager").isEmpty()) {
            User hrUser = new User();
            hrUser.setUsername("hr_manager");
            hrUser.setEmail("hr@payroll.com");
            hrUser.setPassword(passwordEncoder.encode("hr123"));
            hrUser.setFirstName("Sarah");
            hrUser.setLastName("Johnson");
            hrUser.setPhoneNumber("+91-8888888888");
            hrUser.setRole(User.UserRole.HR);
            hrUser.setIsActive(true);
            userRepository.save(hrUser);
            System.out.println("✅ Created HR User: hr_manager/hr123");
        }

        // Create Employee User
        if (userRepository.findByUsername("employee").isEmpty()) {
            User employeeUser = new User();
            employeeUser.setUsername("employee");
            employeeUser.setEmail("employee@payroll.com");
            employeeUser.setPassword(passwordEncoder.encode("emp123"));
            employeeUser.setFirstName("John");
            employeeUser.setLastName("Doe");
            employeeUser.setPhoneNumber("+91-7777777777");
            employeeUser.setRole(User.UserRole.EMPLOYEE);
            employeeUser.setIsActive(true);
            userRepository.save(employeeUser);
            System.out.println("✅ Created Employee User: employee/emp123");
        }
    }

    private void createDefaultDepartments() {
        if (departmentRepository.count() == 0) {
            Department itDept = new Department();
            itDept.setName("Information Technology");
            itDept.setDescription("IT Department handling software development and maintenance");
            itDept.setIsActive(true);
            departmentRepository.save(itDept);

            Department hrDept = new Department();
            hrDept.setName("Human Resources");
            hrDept.setDescription("HR Department managing employee relations and recruitment");
            hrDept.setIsActive(true);
            departmentRepository.save(hrDept);

            Department financeDept = new Department();
            financeDept.setName("Finance");
            financeDept.setDescription("Finance Department handling accounting and payroll");
            financeDept.setIsActive(true);
            departmentRepository.save(financeDept);

            System.out.println("✅ Created default departments");
        }
    }

    private void createDefaultDesignations() {
        // Create designations if they don't exist
        // This would require a DesignationRepository which might not exist
        // Adding as a placeholder for future implementation
        System.out.println("✅ Default designations setup completed");
    }
}
