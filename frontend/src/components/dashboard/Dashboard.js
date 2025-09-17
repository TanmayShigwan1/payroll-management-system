import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { employeeService, payrollService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import CurrencyInfo from '../common/CurrencyInfo';
import { Bar, Pie } from 'react-chartjs-2';
import { CurrencyContext } from '../../contexts/CurrencyContext';
import { convertUSDtoINR, formatCurrency } from '../../utils/currencyUtils';
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
 * Dashboard component.
 * Displays an overview of the payroll system with key metrics and charts.
 */
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    salariedEmployees: 0,
    hourlyEmployees: 0,
    monthlyPayroll: 0
  });
  
  // Get currency from context
  const { currency } = useContext(CurrencyContext);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch this data from the backend
        // For now, we'll simulate it with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        setStats({
          totalEmployees: 24,
          salariedEmployees: 15,
          hourlyEmployees: 9,
          monthlyPayroll: 87250.50
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        label: `Monthly Payroll (${currency})`,
        data: currency === 'USD' 
          ? [75000, 78500, 82000, 83500, 85700, 87250]
          : [75000, 78500, 82000, 83500, 85700, 87250].map(val => convertUSDtoINR(val)),
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
              {formatCurrency(
                currency === 'USD' 
                  ? stats.monthlyPayroll 
                  : convertUSDtoINR(stats.monthlyPayroll),
                currency
              )}
            </h2>
            <p className="dashboard-card-description">Current month's total</p>
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