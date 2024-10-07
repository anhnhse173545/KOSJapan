import React, { useState } from 'react';
import './index.scss'; // Assuming you're using a SCSS file for styling

const RequestPage = () => {
  const [status, setStatus] = useState('Pending'); // Example state

  const handleStatusChange = () => {
    // Function to change status or handle any actions
    setStatus('Approved');
  };

  return (
    <div className="request-page-container">
      {/* Header */}
      <h1>Request</h1>

      {/* Info Section */}
      <div className="info-section">
        <h2>Info</h2>
        <p>General information about the request will go here.</p>
      </div>

      {/* Request Details Section */}
      <div className="request-details-section">
        <h2>Request Details</h2>
        <div className="status-container">
          <p>Status: <strong>{status}</strong></p>
          <button onClick={handleStatusChange} className="detail-button">Detail</button>
        </div>
      </div>

      {/* Additional Section */}
      <div className="additional-section">
        <p>Additional content or details go here.</p>
        <button className="detail-button">Detail</button>
      </div>
    </div>
  );
};

export default RequestPage;
