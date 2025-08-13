package com.payroll.controller;

import com.payroll.model.Admin;
import com.payroll.model.HRManager;
import com.payroll.model.EmployeeDetails;
import com.payroll.model.Person;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Inheritance Demo Controller
 * Demonstrates Java inheritance concepts with Person, Admin, HRManager, and EmployeeDetails classes
 */
@RestController
@RequestMapping("/api/inheritance-demo")
@CrossOrigin(origins = "*")
public class InheritanceDemoController {

    @GetMapping("/demo")
    public ResponseEntity<Map<String, Object>> getInheritanceDemo() {
        Map<String, Object> response = new HashMap<>();
        
        // Create instances demonstrating inheritance
        Admin admin = new Admin("John", "Administrator", "admin@company.com", "SUPER_ADMIN");
        admin.setPhoneNumber("+1-555-0001");
        admin.setAccessLevel(5);
        
        HRManager hrManager = new HRManager("Sarah", "Johnson", "sarah.hr@company.com", "HR001", "PAYROLL");
        hrManager.setPhoneNumber("+1-555-0002");
        hrManager.setYearsOfExperience(8);
        hrManager.setCertification("PHR Certified");
        
        EmployeeDetails employee = new EmployeeDetails("Mike", "Smith", "mike.emp@company.com", "EMP001", null, null);
        employee.setPhoneNumber("+1-555-0003");
        
        // Demonstrate polymorphism - treating different objects as Person
        List<Person> persons = new ArrayList<>();
        persons.add(admin);
        persons.add(hrManager);
        persons.add(employee);
        
        List<Map<String, Object>> personDetails = new ArrayList<>();
        for (Person person : persons) {
            Map<String, Object> personInfo = new HashMap<>();
            personInfo.put("id", person.getId());
            personInfo.put("fullName", person.getFullName());
            personInfo.put("email", person.getEmail());
            personInfo.put("personType", person.getPersonType());
            personInfo.put("displayName", person.getDisplayName());
            personInfo.put("contactInfo", person.getContactInfo());
            
            // Demonstrate method overriding and specific methods
            if (person instanceof Admin) {
                Admin a = (Admin) person;
                personInfo.put("adminLevel", a.getAdminLevel());
                personInfo.put("canAccessAllDepartments", a.canAccessAllDepartments());
                personInfo.put("hasSystemPermissions", a.hasSystemPermissions());
                personInfo.put("adminSummary", a.getAdminSummary());
            } else if (person instanceof HRManager) {
                HRManager hr = (HRManager) person;
                personInfo.put("hrId", hr.getHrId());
                personInfo.put("specialization", hr.getSpecialization());
                personInfo.put("yearsOfExperience", hr.getYearsOfExperience());
                personInfo.put("canManagePayroll", hr.canManagePayroll());
                personInfo.put("isExperiencedHR", hr.isExperiencedHR());
                personInfo.put("hrSummary", hr.getHRSummary());
            } else if (person instanceof EmployeeDetails) {
                EmployeeDetails emp = (EmployeeDetails) person;
                personInfo.put("employeeId", emp.getEmployeeId());
                personInfo.put("isActiveEmployee", emp.isActiveEmployee());
                personInfo.put("employeeSummary", emp.getEmployeeSummary());
            }
            
            personDetails.add(personInfo);
        }
        
        response.put("inheritance_concept", "Java Inheritance Demo");
        response.put("description", "This demonstrates inheritance where Admin, HRManager, and EmployeeDetails classes extend the Person base class");
        response.put("base_class", "Person (Abstract Class)");
        response.put("derived_classes", List.of("Admin", "HRManager", "EmployeeDetails"));
        response.put("concepts_demonstrated", List.of(
            "Abstract Classes and Methods",
            "Method Overriding", 
            "Polymorphism",
            "Inheritance",
            "Method Overloading",
            "Super Class Constructor Calls"
        ));
        response.put("persons", personDetails);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/inheritance-hierarchy")
    public ResponseEntity<Map<String, Object>> getInheritanceHierarchy() {
        Map<String, Object> response = new HashMap<>();
        
        Map<String, Object> hierarchy = new HashMap<>();
        hierarchy.put("Person (Abstract Base Class)", Map.of(
            "properties", List.of("id", "firstName", "lastName", "email", "phoneNumber", "createdAt", "updatedAt"),
            "abstractMethods", List.of("getPersonType()", "getDisplayName()"),
            "concreteMethods", List.of("getFullName()", "getContactInfo()")
        ));
        
        hierarchy.put("Admin extends Person", Map.of(
            "additionalProperties", List.of("adminLevel", "departmentAccess", "permissions", "lastLogin", "accessLevel"),
            "overriddenMethods", List.of("getPersonType()", "getDisplayName()", "getContactInfo()"),
            "specificMethods", List.of("canAccessAllDepartments()", "hasSystemPermissions()", "getAdminSummary()")
        ));
        
        hierarchy.put("HRManager extends Person", Map.of(
            "additionalProperties", List.of("hrId", "specialization", "yearsOfExperience", "certification", "departmentAssigned", "hireDate", "employeeCountLimit"),
            "overriddenMethods", List.of("getPersonType()", "getDisplayName()", "getContactInfo()"),
            "specificMethods", List.of("canManagePayroll()", "canManageRecruitment()", "isExperiencedHR()", "getHRSummary()", "canHandleEmployeeCount()")
        ));
        
        hierarchy.put("EmployeeDetails extends Person", Map.of(
            "additionalProperties", List.of("employeeId", "department", "designation", "hireDate", "basicSalary", "employmentStatus"),
            "overriddenMethods", List.of("getPersonType()", "getDisplayName()", "getContactInfo()"),
            "specificMethods", List.of("isActiveEmployee()", "getEmployeeSummary()", "isEligibleForPayroll()")
        ));
        
        response.put("inheritance_hierarchy", hierarchy);
        response.put("note", "This demonstrates the 'IS-A' relationship in Object-Oriented Programming");
        
        return ResponseEntity.ok(response);
    }
}
