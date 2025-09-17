import React from 'react';
import { Alert } from 'react-bootstrap';

/**
 * Error alert component.
 * Displays an error message with optional details.
 * 
 * @param {Object} props Component props
 * @param {string} props.message The error message to display
 * @param {string} [props.details] Optional error details
 * @param {Function} [props.onClose] Optional close handler
 */
const ErrorAlert = ({ message, details, onClose }) => {
  return (
    <Alert variant="danger" dismissible={Boolean(onClose)} onClose={onClose}>
      <Alert.Heading>Error</Alert.Heading>
      <p>{message}</p>
      {details && (
        <details>
          <summary>Error Details</summary>
          <pre className="mt-2 text-danger">{details}</pre>
        </details>
      )}
    </Alert>
  );
};

export default ErrorAlert;