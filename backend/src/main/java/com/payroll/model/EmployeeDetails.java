package com.payroll.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * EmployeeDetails class extending Person - demonstrates inheritance concept
 * This class inherits all properties and methods from Person class
 * and adds employee-specific properties and methods
 */
@Entity
@Table(name = "employee_details")
@DiscriminatorValue("EMPLOYEE")
@PrimaryKeyJoinColumn(name = "person_id")
public class EmployeeDetails extends Person {
    
    @NotBlank
    @Column(name = "employee_id", unique = true)
    private String employeeId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "designation_id")
    private Designation designation;
    
    @Column(name = "hire_date")
    private LocalDate hireDate;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    private Employee.Gender gender;
    
    @Column(name = "marital_status")
    @Enumerated(EnumType.STRING)
    private Employee.MaritalStatus maritalStatus;
    
    private String address;
    
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;
    
    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;
    
    @Column(name = "bank_account_number")
    private String bankAccountNumber;
    
    @Column(name = "bank_name")
    private String bankName;
    
    @Column(name = "bank_ifsc_code")
    private String bankIfscCode;
    
    @Column(name = "pan_number")
    private String panNumber;
    
    @Column(name = "aadhar_number")
    private String aadharNumber;
    
    @Column(name = "basic_salary", precision = 10, scale = 2)
    private BigDecimal basicSalary;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "employment_status")
    private Employee.EmploymentStatus employmentStatus = Employee.EmploymentStatus.ACTIVE;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PayrollRecord> payrollRecords;
    
    // Constructors
    public EmployeeDetails() {
        super();
    }
    
    public EmployeeDetails(String firstName, String lastName, String email, String employeeId, 
                          Department department, Designation designation) {
        super(firstName, lastName, email);
        this.employeeId = employeeId;
        this.department = department;
        this.designation = designation;
        this.hireDate = LocalDate.now();
    }
    
    // Implementing abstract methods from Person class
    @Override
    public String getPersonType() {
        return "EMPLOYEE";
    }
    
    @Override
    public String getDisplayName() {
        String deptInfo = department != null ? department.getName() : "No Department";
        String designationInfo = designation != null ? designation.getTitle() : "No Designation";
        return "Employee: " + getFullName() + " (" + designationInfo + ", " + deptInfo + ")";
    }
    
    // Overriding inherited method to add employee-specific logic
    @Override
    public String getContactInfo() {
        return super.getContactInfo() + " [Employee ID: " + employeeId + "]";
    }
    
    // Employee-specific methods
    public boolean isActiveEmployee() {
        return employmentStatus == Employee.EmploymentStatus.ACTIVE;
    }
    
    public String getEmployeeSummary() {
        return String.format("Employee: %s (%s) - ID: %s, Department: %s, Status: %s", 
                           getFullName(), getEmail(), employeeId, 
                           department != null ? department.getName() : "N/A", 
                           employmentStatus);
    }
    
    public boolean isEligibleForPayroll() {
        return isActiveEmployee() && basicSalary != null && basicSalary.compareTo(BigDecimal.ZERO) > 0;
    }
    
    // Getters and Setters
    public String getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }
    
    public Department getDepartment() {
        return department;
    }
    
    public void setDepartment(Department department) {
        this.department = department;
    }
    
    public Designation getDesignation() {
        return designation;
    }
    
    public void setDesignation(Designation designation) {
        this.designation = designation;
    }
    
    public LocalDate getHireDate() {
        return hireDate;
    }
    
    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public Employee.Gender getGender() {
        return gender;
    }
    
    public void setGender(Employee.Gender gender) {
        this.gender = gender;
    }
    
    public Employee.MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }
    
    public void setMaritalStatus(Employee.MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getEmergencyContactName() {
        return emergencyContactName;
    }
    
    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }
    
    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }
    
    public void setEmergencyContactPhone(String emergencyContactPhone) {
        this.emergencyContactPhone = emergencyContactPhone;
    }
    
    public String getBankAccountNumber() {
        return bankAccountNumber;
    }
    
    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }
    
    public String getBankName() {
        return bankName;
    }
    
    public void setBankName(String bankName) {
        this.bankName = bankName;
    }
    
    public String getBankIfscCode() {
        return bankIfscCode;
    }
    
    public void setBankIfscCode(String bankIfscCode) {
        this.bankIfscCode = bankIfscCode;
    }
    
    public String getPanNumber() {
        return panNumber;
    }
    
    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }
    
    public String getAadharNumber() {
        return aadharNumber;
    }
    
    public void setAadharNumber(String aadharNumber) {
        this.aadharNumber = aadharNumber;
    }
    
    public BigDecimal getBasicSalary() {
        return basicSalary;
    }
    
    public void setBasicSalary(BigDecimal basicSalary) {
        this.basicSalary = basicSalary;
    }
    
    public Employee.EmploymentStatus getEmploymentStatus() {
        return employmentStatus;
    }
    
    public void setEmploymentStatus(Employee.EmploymentStatus employmentStatus) {
        this.employmentStatus = employmentStatus;
    }
    
    public List<PayrollRecord> getPayrollRecords() {
        return payrollRecords;
    }
    
    public void setPayrollRecords(List<PayrollRecord> payrollRecords) {
        this.payrollRecords = payrollRecords;
    }
}
