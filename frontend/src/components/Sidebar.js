import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser, hasAnyRole } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard',
      roles: ['ADMIN', 'HR', 'EMPLOYEE', 'MANAGER']
    },
    {
      path: '/employees',
      icon: 'fas fa-users',
      label: 'Employees',
      roles: ['ADMIN', 'HR', 'MANAGER']
    },
    {
      path: '/departments',
      icon: 'fas fa-building',
      label: 'Departments',
      roles: ['ADMIN', 'HR']
    },
    {
      path: '/designations',
      icon: 'fas fa-user-tie',
      label: 'Designations',
      roles: ['ADMIN', 'HR']
    },
    {
      path: '/payroll',
      icon: 'fas fa-money-check-alt',
      label: 'Payroll',
      roles: ['ADMIN', 'HR', 'EMPLOYEE']
    },
    {
      path: '/payroll/process',
      icon: 'fas fa-calculator',
      label: 'Process Payroll',
      roles: ['ADMIN', 'HR']
    },
    {
      path: '/reports',
      icon: 'fas fa-chart-bar',
      label: 'Reports',
      roles: ['ADMIN', 'HR', 'MANAGER']
    },
    {
      path: '/profile',
      icon: 'fas fa-user',
      label: 'Profile',
      roles: ['ADMIN', 'HR', 'EMPLOYEE', 'MANAGER']
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4 className="mb-0">
          <i className="fas fa-money-check-alt me-2"></i>
          PayrollMS
        </h4>
        <small className="text-light">
          Welcome, {currentUser?.firstName}
        </small>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          if (!hasAnyRole(item.roles)) {
            return null;
          }

          return (
            <div key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path)}`}
              >
                <i className={item.icon}></i>
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
      
      <div className="sidebar-footer mt-auto p-3">
        <div className="text-center">
          <small className="text-light opacity-75">
            © 2024 PayrollMS v1.0
          </small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
