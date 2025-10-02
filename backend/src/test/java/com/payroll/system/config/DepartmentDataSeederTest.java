package com.payroll.system.config;

import com.payroll.system.model.Department;
import com.payroll.system.repository.DepartmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.DefaultApplicationArguments;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentDataSeederTest {

    @Mock
    private DepartmentRepository departmentRepository;

    private DepartmentDataSeeder seeder;

    DepartmentDataSeederTest() {
        // The mock will be injected by Mockito before each test
    }

    private void initSeeder(boolean enabled) {
        seeder = new DepartmentDataSeeder(departmentRepository, enabled);
    }

    @Test
    void runDoesNothingWhenSeedingDisabled() throws Exception {
    initSeeder(false);

    seeder.run(new DefaultApplicationArguments(new String[0]));

        verifyNoInteractions(departmentRepository);
    }

    @Test
    void runCreatesMissingDepartments() throws Exception {
    initSeeder(true);
        when(departmentRepository.findByNameIgnoreCase(ArgumentMatchers.anyString()))
                .thenReturn(Optional.empty());

        seeder.run(new DefaultApplicationArguments(new String[0]));

        verify(departmentRepository, times(7)).save(any(Department.class));
    }

    @Test
    void runUpdatesExistingDepartmentsWhenMetadataMissing() throws Exception {
        initSeeder(true);
        Department existing = new Department();
        existing.setName("Human Resources");
        existing.setCostCenter(null);
        existing.setDescription(null);

        when(departmentRepository.findByNameIgnoreCase(ArgumentMatchers.anyString()))
                .thenAnswer(invocation -> {
                    String name = invocation.getArgument(0);
                    if (name.equalsIgnoreCase("Human Resources")) {
                        return Optional.of(existing);
                    }
                    return Optional.empty();
                });

        seeder.run(new DefaultApplicationArguments(new String[0]));

        assertThat(existing.getCostCenter()).isEqualTo("HR-001");
        assertThat(existing.getDescription()).isEqualTo("Employee relations, benefits, and recruiting.");
        verify(departmentRepository, atLeastOnce()).save(existing);
    }
}
