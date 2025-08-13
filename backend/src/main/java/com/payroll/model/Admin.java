package com.payroll.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

/**
 * Admin class extending Person - demonstrates inheritance concept
 * This class inherits all properties and methods from Person class
 * and adds admin-specific properties and methods
 */
@Entity
@Table(name = "admins")
@DiscriminatorValue("ADMIN")
@PrimaryKeyJoinColumn(name = "person_id")
public class Admin extends Person {
    
    @Column(name = "admin_level")
    private String adminLevel; // SUPER_ADMIN, ADMIN, SYSTEM_ADMIN
    
    @Column(name = "department_access")
    private String departmentAccess; // ALL, SPECIFIC
    
    @Column(name = "permissions")
    private String permissions; // JSON string of permissions
    
    @Column(name = "last_login")
    private LocalDate lastLogin;
    
    @Column(name = "access_level")
    private Integer accessLevel = 1; // 1-5 scale
    
    // Constructors
    public Admin() {
        super();
    }
    
    public Admin(String firstName, String lastName, String email, String adminLevel) {
        super(firstName, lastName, email);
        this.adminLevel = adminLevel;
        this.departmentAccess = "ALL";
        this.accessLevel = 5; // Maximum access for admin
    }
    
    // Implementing abstract methods from Person class
    @Override
    public String getPersonType() {
        return "ADMIN";
    }
    
    @Override
    public String getDisplayName() {
        return "Administrator: " + getFullName();
    }
    
    // Overriding inherited method to add admin-specific logic
    @Override
    public String getContactInfo() {
        return super.getContactInfo() + " [Admin Level: " + adminLevel + "]";
    }
    
    // Admin-specific methods
    public boolean canAccessAllDepartments() {
        return "ALL".equals(departmentAccess) || accessLevel >= 4;
    }
    
    public boolean hasSystemPermissions() {
        return accessLevel >= 5 || "SUPER_ADMIN".equals(adminLevel);
    }
    
    public String getAdminSummary() {
        return String.format("Admin: %s (%s) - Level: %s, Access: %d", 
                           getFullName(), email, adminLevel, accessLevel);
    }
    
    // Getters and Setters
    public String getAdminLevel() {
        return adminLevel;
    }
    
    public void setAdminLevel(String adminLevel) {
        this.adminLevel = adminLevel;
    }
    
    public String getDepartmentAccess() {
        return departmentAccess;
    }
    
    public void setDepartmentAccess(String departmentAccess) {
        this.departmentAccess = departmentAccess;
    }
    
    public String getPermissions() {
        return permissions;
    }
    
    public void setPermissions(String permissions) {
        this.permissions = permissions;
    }
    
    public LocalDate getLastLogin() {
        return lastLogin;
    }
    
    public void setLastLogin(LocalDate lastLogin) {
        this.lastLogin = lastLogin;
    }
    
    public Integer getAccessLevel() {
        return accessLevel;
    }
    
    public void setAccessLevel(Integer accessLevel) {
        this.accessLevel = accessLevel;
    }
}
