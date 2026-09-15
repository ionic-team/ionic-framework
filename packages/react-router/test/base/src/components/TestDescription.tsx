import React from 'react';
import './TestDescription.css';

const TestDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="test-description">
    <strong>Test:</strong> {children}
  </p>
);

export default TestDescription;
