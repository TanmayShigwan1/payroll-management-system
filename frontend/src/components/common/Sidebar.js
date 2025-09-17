import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar component for navigation.
 * Displays links to different sections of the application.
 */
const Sidebar = () => {
  const location = useLocation();
  
  // Check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <Nav className="flex-column sidebar-nav">
        <Nav.Link 
          as={Link} 
          to="/" 
          className={`sidebar-nav-item ${isActive('/') ? 'active' : ''}`}
        >
          <i className="bi bi-speedometer2 sidebar-nav-icon"></i>
          Dashboard
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/employees" 
          className={`sidebar-nav-item ${isActive('/employees') ? 'active' : ''}`}
        >
          <i className="bi bi-people sidebar-nav-icon"></i>
          Employees
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/payroll" 
          className={`sidebar-nav-item ${isActive('/payroll') ? 'active' : ''}`}
        >
          <i className="bi bi-calculator sidebar-nav-icon"></i>
          Payroll Processing
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/payslips" 
          className={`sidebar-nav-item ${isActive('/payslips') ? 'active' : ''}`}
        >
          <i className="bi bi-file-earmark-text sidebar-nav-icon"></i>
          PaySlips
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/reports" 
          className={`sidebar-nav-item ${isActive('/reports') ? 'active' : ''}`}
        >
          <i className="bi bi-bar-chart sidebar-nav-icon"></i>
          Reports
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/settings" 
          className={`sidebar-nav-item ${isActive('/settings') ? 'active' : ''}`}
        >
          <i className="bi bi-gear sidebar-nav-icon"></i>
          Settings
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;