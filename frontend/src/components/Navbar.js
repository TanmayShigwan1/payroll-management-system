import React from 'react';

const Navbar = () => {

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">
          <i className="fas fa-money-check-alt me-2"></i>
          Payroll Management System
        </span>
        
        <div className="navbar-nav ms-auto">
          <div className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle d-flex align-items-center"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="me-2">
                <i className="fas fa-user-circle fa-lg"></i>
              </div>
              <div className="text-start">
                <div className="fw-bold">
                  Demo User
                </div>
                <small className="text-muted">Admin/HR/Employee</small>
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a className="dropdown-item" href="/profile">
                  <i className="fas fa-user me-2"></i>
                  Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <div className="dropdown-item-text">
                  <small>Available Users:</small><br/>
                  <small>• admin/admin123</small><br/>
                  <small>• hr_manager/hr123</small><br/>
                  <small>• employee/emp123</small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
