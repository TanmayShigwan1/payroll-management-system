package com.payroll.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

/**
 * HR Manager class extending Person - demonstrates inheritance concept
 * This class inherits all properties and methods from Person class
 * and adds HR-specific properties and methods
 */
@Entity
@Table(name = "hr_managers")
@DiscriminatorValue("HR")
@PrimaryKeyJoinColumn(name = "person_id")
public class HRManager extends Person {
    
    @Column(name = "hr_id", unique = true)
    private String hrId;
    
    @Column(name = "specialization")
    private String specialization; // RECRUITMENT, PAYROLL, EMPLOYEE_RELATIONS, etc.
    
    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;
    
    @Column(name = "certification")
    private String certification;
    
    @Column(name = "department_assigned")
    private String departmentAssigned;
    
    @Column(name = "hire_date")
    private LocalDate hireDate;
    
    @Column(name = "employee_count_limit")
    private Integer employeeCountLimit = 100; // Max employees this HR can manage
    
    // Constructors
    public HRManager() {
        super();
    }
    
    public HRManager(String firstName, String lastName, String email, String hrId, String specialization) {
        super(firstName, lastName, email);
        this.hrId = hrId;
        this.specialization = specialization;
        this.hireDate = LocalDate.now();
    }
    
    // Implementing abstract methods from Person class
    @Override
    public String getPersonType() {
        return "HR_MANAGER";
    }
    
    @Override
    public String getDisplayName() {
        return "HR Manager: " + getFullName() + " (" + specialization + ")";
    }
    
    // Overriding inherited method to add HR-specific logic
    @Override
    public String getContactInfo() {
        return super.getContactInfo() + " [HR ID: " + hrId + ", Specialization: " + specialization + "]";
    }
    
    // HR-specific methods
    public boolean canManagePayroll() {
        return "PAYROLL".equals(specialization) || "ALL".equals(specialization);
    }
    
    public boolean canManageRecruitment() {
        return "RECRUITMENT".equals(specialization) || "ALL".equals(specialization);
    }
    
    public boolean isExperiencedHR() {
        return yearsOfExperience != null && yearsOfExperience >= 5;
    }
    
    public String getHRSummary() {
        return String.format("HR: %s (%s) - ID: %s, Specialization: %s, Experience: %d years", 
                           getFullName(), email, hrId, specialization, 
                           yearsOfExperience != null ? yearsOfExperience : 0);
    }
    
    public boolean canHandleEmployeeCount(int count) {
        return count <= employeeCountLimit;
    }
    
    // Getters and Setters
    public String getHrId() {
        return hrId;
    }
    
    public void setHrId(String hrId) {
        this.hrId = hrId;
    }
    
    public String getSpecialization() {
        return specialization;
    }
    
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
    
    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }
    
    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }
    
    public String getCertification() {
        return certification;
    }
    
    public void setCertification(String certification) {
        this.certification = certification;
    }
    
    public String getDepartmentAssigned() {
        return departmentAssigned;
    }
    
    public void setDepartmentAssigned(String departmentAssigned) {
        this.departmentAssigned = departmentAssigned;
    }
    
    public LocalDate getHireDate() {
        return hireDate;
    }
    
    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }
    
    public Integer getEmployeeCountLimit() {
        return employeeCountLimit;
    }
    
    public void setEmployeeCountLimit(Integer employeeCountLimit) {
        this.employeeCountLimit = employeeCountLimit;
    }
}
