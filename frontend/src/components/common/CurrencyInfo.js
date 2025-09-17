import React, { useContext } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { CurrencyContext } from '../../contexts/CurrencyContext';
import { formatCurrency, convertUSDtoINR, USD_TO_INR_RATE } from '../../utils/currencyUtils';

/**
 * Currency Info component.
 * Displays information about the current exchange rate and currency selection.
 */
const CurrencyInfo = () => {
  const { currency } = useContext(CurrencyContext);
  
  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-currency-exchange me-2"></i>
          Currency Information
        </h5>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6>Current Currency:</h6>
            <h4>
              <Badge bg={currency === 'USD' ? 'primary' : 'success'}>
                {currency === 'USD' ? 'US Dollar ($)' : 'Indian Rupee (₹)'}
              </Badge>
            </h4>
          </div>
          <div className="text-end">
            <h6>Exchange Rate:</h6>
            <p className="mb-0">1 USD = {USD_TO_INR_RATE} INR</p>
            <p className="mb-0">1 INR = {(1 / USD_TO_INR_RATE).toFixed(4)} USD</p>
          </div>
        </div>
        
        <p className="text-muted small mb-0">
          <i className="bi bi-info-circle me-1"></i>
          You can change the currency by using the dropdown in the header.
          All monetary values will be converted automatically.
        </p>
      </Card.Body>
    </Card>
  );
};

export default CurrencyInfo;