import React from 'react';
import { Spinner } from 'react-bootstrap';

/**
 * Loading spinner component.
 * Displays a centered spinner with optional message.
 * 
 * @param {Object} props Component props
 * @param {string} [props.message='Loading...'] Optional message to display
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="text-center p-5">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3">{message}</p>
    </div>
  );
};

export default LoadingSpinner;