import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * Currency selector component
 * Allows users to switch between different currencies (USD and INR)
 */
const CurrencySelector = ({ selectedCurrency, onCurrencyChange }) => {
  return (
    <Form.Group className="currency-selector">
      <Form.Select 
        size="sm"
        value={selectedCurrency} 
        onChange={(e) => onCurrencyChange(e.target.value)}
        aria-label="Currency selector"
      >
        <option value="USD">USD ($)</option>
        <option value="INR">INR (₹)</option>
      </Form.Select>
    </Form.Group>
  );
};

export default CurrencySelector;