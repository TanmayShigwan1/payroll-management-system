import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser, hasAnyRole } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalDepartments: 0,
    monthlyPayrollCost: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats - In real app, fetch from API
    const loadStats = async () => {
      setTimeout(() => {
        setStats({
          totalEmployees: 150,
          activeEmployees: 145,
          totalDepartments: 6,
          monthlyPayrollCost: 2450000
        });
        setLoading(false);
      }, 1000);
    };

    loadStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin fa-2x"></i>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Dashboard</h1>
        <div className="text-muted">
          <i className="fas fa-calendar me-2"></i>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card dashboard-card bg-primary text-white">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col">
                  <h4 className="mb-1">
                    Welcome back, {currentUser?.firstName} {currentUser?.lastName}!
                  </h4>
                  <p className="mb-0 opacity-75">
                    You're logged in as {currentUser?.role}. Here's your dashboard overview.
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user-circle fa-3x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {hasAnyRole(['ADMIN', 'HR', 'MANAGER']) && (
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card dashboard-card h-100">
              <div className="card-body text-center">
                <div className="stat-icon text-primary mb-2">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="mb-1">{stats.totalEmployees}</h3>
                <p className="text-muted mb-0">Total Employees</p>
                <small className="text-success">
                  <i className="fas fa-arrow-up"></i> +5 this month
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card dashboard-card h-100">
              <div className="card-body text-center">
                <div className="stat-icon text-success mb-2">
                  <i className="fas fa-user-check"></i>
                </div>
                <h3 className="mb-1">{stats.activeEmployees}</h3>
                <p className="text-muted mb-0">Active Employees</p>
                <small className="text-success">
                  <i className="fas fa-check"></i> {((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)}% active
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card dashboard-card h-100">
              <div className="card-body text-center">
                <div className="stat-icon text-info mb-2">
                  <i className="fas fa-building"></i>
                </div>
                <h3 className="mb-1">{stats.totalDepartments}</h3>
                <p className="text-muted mb-0">Departments</p>
                <small className="text-muted">
                  <i className="fas fa-building"></i> Across organization
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card dashboard-card h-100">
              <div className="card-body text-center">
                <div className="stat-icon text-warning mb-2">
                  <i className="fas fa-money-check-alt"></i>
                </div>
                <h3 className="mb-1">{formatCurrency(stats.monthlyPayrollCost)}</h3>
                <p className="text-muted mb-0">Monthly Payroll</p>
                <small className="text-info">
                  <i className="fas fa-calendar"></i> Current month
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card dashboard-card">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {hasAnyRole(['ADMIN', 'HR']) && (
                  <>
                    <div className="col-md-6 mb-3">
                      <a href="/employees/new" className="text-decoration-none">
                        <div className="p-3 border rounded hover-shadow">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className="fas fa-user-plus fa-2x text-primary"></i>
                            </div>
                            <div>
                              <h6 className="mb-1">Add Employee</h6>
                              <small className="text-muted">Register new employee</small>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>

                    <div className="col-md-6 mb-3">
                      <a href="/payroll/process" className="text-decoration-none">
                        <div className="p-3 border rounded hover-shadow">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <i className="fas fa-calculator fa-2x text-success"></i>
                            </div>
                            <div>
                              <h6 className="mb-1">Process Payroll</h6>
                              <small className="text-muted">Calculate monthly payroll</small>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </>
                )}

                <div className="col-md-6 mb-3">
                  <a href="/payroll" className="text-decoration-none">
                    <div className="p-3 border rounded hover-shadow">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="fas fa-file-invoice fa-2x text-info"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">View Payslips</h6>
                          <small className="text-muted">Access salary slips</small>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="col-md-6 mb-3">
                  <a href="/reports" className="text-decoration-none">
                    <div className="p-3 border rounded hover-shadow">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="fas fa-chart-bar fa-2x text-warning"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">Reports</h6>
                          <small className="text-muted">View analytics & reports</small>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card dashboard-card">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">
                <i className="fas fa-bell me-2"></i>
                Recent Activity
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="fas fa-user-plus text-primary"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">New Employee Added</h6>
                      <small className="text-muted">John Smith joined IT Department</small>
                    </div>
                  </div>
                </div>

                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="fas fa-calculator text-success"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Payroll Processed</h6>
                      <small className="text-muted">November 2024 payroll completed</small>
                    </div>
                  </div>
                </div>

                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="fas fa-file-alt text-info"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Report Generated</h6>
                      <small className="text-muted">Monthly payroll summary created</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
