import React, { useContext } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CurrencySelector from './CurrencySelector';
import { CurrencyContext } from '../../contexts/CurrencyContext';

/**
 * Header component for the application.
 * Displays the application title, currency selector, and user information.
 */
const Header = () => {
  const { currency, setCurrency } = useContext(CurrencyContext);
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="app-header">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="header-brand">
          Payroll Management System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-3">
            <CurrencySelector 
              selectedCurrency={currency} 
              onCurrencyChange={setCurrency} 
            />
          </Nav>
          <Nav>
            <div className="header-user">
              <div className="header-user-avatar">
                <img 
                  src="/admin-avatar.jpg" 
                  alt="Admin Avatar" 
                  className="admin-avatar-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2Yjc5ODQiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHg9IjEwIiB5PSI4Ij4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC4xMzQwMSAxNCA1IDE2LjY4NjMgNSAyMEg5SDE1SDE5QzE5IDE2LjY4NjMgMTUuODY2IDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K';
                  }}
                />
              </div>
              <span className="text-light ms-2">Admin</span>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;