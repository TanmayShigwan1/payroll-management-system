package com.payroll.system.config;

import com.payroll.system.model.Department;
import com.payroll.system.repository.DepartmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Seeds a default set of departments to make the application immediately usable.
 * The seeding is idempotent and can be disabled via the {@code payroll.seed-default-departments} property.
 */
@Component
public class DepartmentDataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DepartmentDataSeeder.class);

    private final DepartmentRepository departmentRepository;
    private final boolean seedDepartments;

    public DepartmentDataSeeder(DepartmentRepository departmentRepository,
                                @Value("${payroll.seed-default-departments:true}") boolean seedDepartments) {
        this.departmentRepository = departmentRepository;
        this.seedDepartments = seedDepartments;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!seedDepartments) {
            log.debug("Default department seeding disabled via configuration.");
            return;
        }

        int created = 0;
        int updated = 0;

        for (Department template : defaultDepartments()) {
            var existing = departmentRepository.findByNameIgnoreCase(template.getName());
            if (existing.isEmpty()) {
                departmentRepository.save(template);
                created++;
                continue;
            }

            Department department = existing.get();
            boolean dirty = false;

            if (isBlank(department.getCostCenter()) && !isBlank(template.getCostCenter())) {
                department.setCostCenter(template.getCostCenter());
                dirty = true;
            }

            if (isBlank(department.getDescription()) && !isBlank(template.getDescription())) {
                department.setDescription(template.getDescription());
                dirty = true;
            }

            if (dirty) {
                departmentRepository.save(department);
                updated++;
            }
        }

        if (created > 0 || updated > 0) {
            log.info("Default department seeding completed: {} created, {} updated.", created, updated);
        } else {
            log.debug("Default departments already present; no seeding required.");
        }
    }

    private List<Department> defaultDepartments() {
        return List.of(
                department("Human Resources", "HR-001", "Employee relations, benefits, and recruiting."),
                department("Finance", "FIN-100", "Financial planning, accounting, and payroll oversight."),
                department("Engineering", "ENG-200", "Product development and technical delivery."),
                department("Sales", "SAL-300", "Revenue generation and client acquisition."),
                department("Operations", "OPS-400", "Business operations and vendor management."),
                department("Customer Support", "SUP-500", "Customer advocacy and support services."),
                department("Information Technology", "IT-600", "Infrastructure, security, and internal systems.")
        );
    }

    private Department department(String name, String costCenter, String description) {
        Department department = new Department();
        department.setName(name);
        department.setCostCenter(costCenter);
        department.setDescription(description);
        return department;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
