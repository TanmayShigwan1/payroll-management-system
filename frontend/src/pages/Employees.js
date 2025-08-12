import React from 'react';

const Employees = () => {
  return (
    <div className="employees">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Employees</h1>
        <button className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Add Employee
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="text-center py-5">
            <i className="fas fa-users fa-4x text-muted mb-3"></i>
            <h4>Employees Management</h4>
            <p className="text-muted">This page will display employee list and management features.</p>
            <p className="text-info">Coming soon in the complete implementation!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
