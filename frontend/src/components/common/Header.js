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
              <div className="header-user-icon">
                <i className="bi bi-person-fill"></i>
              </div>
              <span className="text-light">Admin</span>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;