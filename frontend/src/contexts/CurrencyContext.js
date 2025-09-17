import React, { createContext, useState, useEffect } from 'react';

// Create a context for currency
export const CurrencyContext = createContext();

/**
 * Currency Provider component
 * Manages currency state and provides it to all child components
 */
export const CurrencyProvider = ({ children }) => {
  // Initialize currency from localStorage or default to USD
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency');
    return savedCurrency || 'USD';
  });

  // Save currency preference when it changes
  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;