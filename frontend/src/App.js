import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Layout components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';

// Page components
import Dashboard from './components/dashboard/Dashboard';
import EmployeeList from './components/employee/EmployeeList';
import EmployeeForm from './components/employee/EmployeeForm';
import PayrollProcessing from './components/payroll/PayrollProcessing';
import PaySlipView from './components/payslip/PaySlipView';
import PaySlipList from './components/payslip/PaySlipList';

import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="content-container">
        <Sidebar />
        <Container fluid className="main-content p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/edit/:id" element={<EmployeeForm />} />
            <Route path="/payroll" element={<PayrollProcessing />} />
            <Route path="/payslips" element={<PaySlipList />} />
            <Route path="/payslips/:id" element={<PaySlipView />} />
          </Routes>
        </Container>
      </div>
    </div>
  );
}

export default App;