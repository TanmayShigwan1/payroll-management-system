import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { employeeService, departmentService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import CurrencyInfo from '../common/CurrencyInfo';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * Dashboard component - UPDATED with better debugging.
 * Displays an overview of the payroll system with key metrics and charts.
 */
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    salariedEmployees: 0,
    hourlyEmployees: 0,
    monthlyPayroll: 0,
    activeEmployees: 0,
    onLeaveEmployees: 0,
    terminatedEmployees: 0
  });

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch real employee data from backend
        const [employees, departmentData] = await Promise.all([
          employeeService.getAllEmployees(),
          departmentService.getAllDepartments()
        ]);
        
        // Calculate statistics from real data
        const totalEmployees = employees.length;
        const salariedEmployees = employees.filter(emp => {
          // Check if employee has annual salary (salaried employee)
          const isSalaried = emp.annualSalary && emp.annualSalary > 0;
          return isSalaried;
        }).length;
        
        const hourlyEmployees = employees.filter(emp => {
          // Check if employee has hourly rate (hourly employee)
          const isHourly = emp.hourlyRate && emp.hourlyRate > 0;
          return isHourly;
        }).length;
        
        // Calculate monthly payroll (approximate)
        let monthlyPayroll = 0;
        employees.forEach(emp => {
          if (emp.annualSalary && emp.annualSalary > 0) {
            // For salaried employees: annual salary / 12 months
            monthlyPayroll += emp.annualSalary / 12;
          } else if (emp.hourlyRate && emp.hourlyRate > 0) {
            // For hourly employees: assume 160 hours per month (40 hours/week * 4 weeks)
            monthlyPayroll += emp.hourlyRate * 160;
          }
        });

        // Calculate status statistics
        const activeEmployees = employees.filter(emp => (emp.status || 'Active') === 'Active').length;
        const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave').length;
        const terminatedEmployees = employees.filter(emp => emp.status === 'Terminated').length;
        
        setStats({
          totalEmployees,
          salariedEmployees,
          hourlyEmployees,
          monthlyPayroll: Math.round(monthlyPayroll * 100) / 100,
          activeEmployees,
          onLeaveEmployees,
          terminatedEmployees
        });
        setEmployeeList(employees);
        setDepartments(departmentData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const departmentHeadcount = useMemo(() => {
    if (departments.length === 0 && employeeList.length === 0) {
      return [];
    }

    const counts = departments.map((dept) => {
      const count = employeeList.filter(emp => emp.department?.id === dept.id).length;
      return {
        id: dept.id,
        name: dept.name,
        count
      };
    });

    const unassignedCount = employeeList.filter(emp => !emp.department).length;
    if (unassignedCount > 0) {
      counts.push({ id: 'unassigned', name: 'Unassigned', count: unassignedCount });
    }

    return counts.sort((a, b) => b.count - a.count);
  }, [departments, employeeList]);

  const topDepartments = useMemo(() => departmentHeadcount.slice(0, 5), [departmentHeadcount]);

  const departmentChartData = useMemo(() => {
    if (departmentHeadcount.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Headcount',
            data: [],
            backgroundColor: 'rgba(25, 135, 84, 0.7)'
          }
        ]
      };
    }

    const labels = topDepartments.map((dept) => dept.name);
    const values = topDepartments.map((dept) => dept.count);
    return {
      labels,
      datasets: [
        {
          label: 'Headcount',
          data: values,
          backgroundColor: 'rgba(13, 110, 253, 0.7)'
        }
      ]
    };
  }, [departmentHeadcount, topDepartments]);

  // Prepare chart data
  const employeeChartData = {
    labels: ['Salaried', 'Hourly'],
    datasets: [
      {
        data: [stats.salariedEmployees, stats.hourlyEmployees],
        backgroundColor: ['#0d6efd', '#ffc107'],
        borderColor: ['#0a58ca', '#d39e00'],
        borderWidth: 1,
      },
    ],
  };

  const payrollChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Payroll (₹)',
        data: [750000, 785000, 820000, 835000, 857000, 872500], // Direct INR values
        backgroundColor: 'rgba(13, 110, 253, 0.7)',
      },
    ],
  };

  const payrollChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Payroll Trends',
      },
    },
  };

  const departmentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top Departments by Headcount',
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="dashboard">
      <h2 className="mb-4">Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Total Employees</h5>
              <div className="dashboard-card-icon" style={{ backgroundColor: '#0d6efd' }}>
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
            <h2 className="dashboard-card-value">{stats.totalEmployees}</h2>
            <p className="dashboard-card-description">All active employees</p>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Salaried Employees</h5>
              <div className="dashboard-card-icon" style={{ backgroundColor: '#198754' }}>
                <i className="bi bi-cash-stack"></i>
              </div>
            </div>
            <h2 className="dashboard-card-value">{stats.salariedEmployees}</h2>
            <p className="dashboard-card-description">Employees on fixed salary</p>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Hourly Employees</h5>
              <div className="dashboard-card-icon" style={{ backgroundColor: '#ffc107' }}>
                <i className="bi bi-clock-fill"></i>
              </div>
            </div>
            <h2 className="dashboard-card-value">{stats.hourlyEmployees}</h2>
            <p className="dashboard-card-description">Employees paid by hour</p>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Monthly Payroll</h5>
              <div className="dashboard-card-icon" style={{ backgroundColor: '#dc3545' }}>
                <i className="bi bi-wallet2"></i>
              </div>
            </div>
            <h2 className="dashboard-card-value">
              ₹{stats.monthlyPayroll.toLocaleString('en-IN')}
            </h2>
            <p className="dashboard-card-description">Current month's total</p>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Departments</h5>
              <div className="dashboard-card-icon" style={{ backgroundColor: '#6610f2' }}>
                <i className="bi bi-diagram-3"></i>
              </div>
            </div>
            <h2 className="dashboard-card-value">{departments.length}</h2>
            <p className="dashboard-card-description">Active departments</p>
          </Card>
        </Col>
      </Row>

      {/* Employee Status Statistics */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Active Employees</h5>
              <div className="dashboard-card-icon" style={{ backgroundColor: '#28a745' }}>
                <i className="bi bi-person-check-fill"></i>
              </div>
            </div>
            <h2 className="dashboard-card-value">{stats.activeEmployees || 0}</h2>
            <p className="dashboard-card-description">Currently working</p>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">On Leave</h5>
              <div className="dashboard-card-icon" style={{ backgroundColor: '#ffc107' }}>
                <i className="bi bi-person-dash-fill"></i>
              </div>
            </div>
            <h2 className="dashboard-card-value">{stats.onLeaveEmployees || 0}</h2>
            <p className="dashboard-card-description">Temporarily away</p>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Terminated</h5>
              <div className="dashboard-card-icon" style={{ backgroundColor: '#dc3545' }}>
                <i className="bi bi-person-x-fill"></i>
              </div>
            </div>
            <h2 className="dashboard-card-value">{stats.terminatedEmployees || 0}</h2>
            <p className="dashboard-card-description">No longer employed</p>
          </Card>
        </Col>
      </Row>
      
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>Payroll Trends</Card.Header>
            <Card.Body>
              <Bar data={payrollChartData} options={payrollChartOptions} />
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <CurrencyInfo />
          <Card className="mb-4">
            <Card.Header>Employee Distribution</Card.Header>
            <Card.Body>
              <Pie data={employeeChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>Department Headcount</Card.Header>
            <Card.Body>
              {departmentHeadcount.length === 0 ? (
                <p className="text-muted mb-0">No department headcount data available yet.</p>
              ) : (
                <Bar data={departmentChartData} options={departmentChartOptions} />
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>Quick Links</Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/departments" variant="outline-primary">
                  Manage Departments
                </Button>
                <Button as={Link} to="/time-entries" variant="outline-success">
                  Review Time Entries
                </Button>
                <Button as={Link} to="/employees" variant="outline-secondary">
                  View Employees
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Top Departments</Card.Header>
            <Card.Body>
              {topDepartments.length === 0 ? (
                <p className="text-muted mb-0">No departments to display.</p>
              ) : (
                <Table size="sm" borderless responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th className="text-end">Headcount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDepartments.map((dept) => (
                      <tr key={dept.id}>
                        <td>{dept.name}</td>
                        <td className="text-end">{dept.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Header>Recent Activities</Card.Header>
            <Card.Body>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Payroll Processed</strong>
                    <div className="text-muted small">September payroll for 24 employees</div>
                  </div>
                  <span className="badge bg-primary rounded-pill">Today</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>New Employee Added</strong>
                    <div className="text-muted small">James Wilson joined as Software Developer</div>
                  </div>
                  <span className="badge bg-primary rounded-pill">Yesterday</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Bonus Payment</strong>
                    <div className="text-muted small">Q3 performance bonuses processed</div>
                  </div>
                  <span className="badge bg-primary rounded-pill">3 days ago</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Tax Updates</strong>
                    <div className="text-muted small">Updated tax rates for next fiscal year</div>
                  </div>
                  <span className="badge bg-primary rounded-pill">1 week ago</span>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;