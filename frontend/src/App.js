import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import Departments from './pages/Departments';
import Designations from './pages/Designations';
import Payroll from './pages/Payroll';
import PayrollProcess from './pages/PayrollProcess';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/*" element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="flex-grow-1">
                    <Navbar />
                    <div className="main-content p-4">
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/employees/new" element={<EmployeeForm />} />
                        <Route path="/employees/edit/:id" element={<EmployeeForm />} />
                        <Route path="/departments" element={<Departments />} />
                        <Route path="/designations" element={<Designations />} />
                        <Route path="/payroll" element={<Payroll />} />
                        <Route path="/payroll/process" element={<PayrollProcess />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            } />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
