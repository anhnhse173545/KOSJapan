import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.scss';

// Component to display the trip information
const SingleCustomerStaffData = ({ tripData }) => {
  return (
    <div className="customer-data">
      <h2>Customer Request</h2>
      <div className="customer-data-card">
        <h3>Name: {tripData.customer.name}</h3>
        <p><strong>Email:</strong> {tripData.customer.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {tripData.customer.phone || 'N/A'}</p>
        <p><strong>Koi Description:</strong> {tripData.bookingDescription}</p>
        <p><strong>Start Date:</strong> {tripData.startDate}</p>
        <p><strong>End Date:</strong> {tripData.endDate}</p>
      </div>
    </div>
  );
};

// Component to display sales staff information
const SingleSalesStaffData = ({ salesData }) => {
  return (
    <div className="sales-staff-data">
      <h2>Sales Staff Information</h2>
      <div className="staff-data-card">
        <h3>ID: {salesData.saleStaff.id}</h3>
        <p><strong>Name:</strong> {salesData.saleStaff.name}</p>
        <p><strong>Phone:</strong> {salesData.saleStaff.phone || 'N/A'}</p>
        <p><strong>Email:</strong> {salesData.saleStaff.email || 'N/A'}</p>

      </div>
    </div>
  );
};

// Itinerary Component to display farm visits and koi details
const Itinerary = ({ tripDestinations }) => {
  const navigate = useNavigate();
  const [expandedDays, setExpandedDays] = useState({});

  const toggleDetails = (dayIndex) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));
  };

  return (
    <div className="trip-details">
      {tripDestinations.map((destination, index) => (
        <div key={index} className="day-detail">
          <p><strong>visitDate:</strong> {destination.visitDate || 'N/Á'}</p>
          <p><strong>Trip description:</strong> {destination.description || 'N/Á'}</p>
          <h3>Day {index + 1}</h3>
          <p><strong>Farm:</strong> {destination.farm.name}</p>
          <p><strong>Address:</strong> {destination.farm.address}</p>
          <button className="toggle-button" onClick={() => toggleDetails(index)}>
            {expandedDays[index] ? 'Hide Details' : 'View Details'}
          </button>

          {expandedDays[index] && (
            <div className="koi-details">
              {destination.farm.varieties.length > 0 ? (
                destination.farm.varieties.map((variety, koiIndex) => (
                  <div key={koiIndex} className="koi-item">
                    <p><strong>Variety:</strong> {variety.name}</p>
                    <p>{variety.description}</p>
                  </div>
                ))
              ) : (
                <p>No koi varieties available for this farm.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Main OnGoingPage Component
function OnGoingPage() {
  const { id } = useParams();  // Get ID from URL
  const navigate = useNavigate();

  // State for trip data
  const [tripData, setTripData] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [errorTrip, setErrorTrip] = useState(null);

  // Fetch trip data based on the ID from the URL
  useEffect(() => {
    fetch(`http://localhost:8080/api/trip/get/${id}/customer-sale`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTripData(data);
        setLoadingTrip(false);
      })
      .catch((error) => {
        setErrorTrip(error);
        setLoadingTrip(false);
      });
  }, [id]);

  // Loading and error handling for both APIs
  if (loadingTrip) {
    return <div>Loading data...</div>;
  }

  if (errorTrip) {
    return <div>Error loading trip data: {errorTrip.message}</div>;
  }

  return (
    <div className="quota-details-page">
      <h2>Trip Details for Quotation ID: {id}</h2>

      <div className="customer-sales-container">
        {/* Display Trip Information */}
        <div className="left-side">
          {tripData && <SingleCustomerStaffData tripData={tripData} />}
          {tripData.tripDestinations && <Itinerary tripDestinations={tripData.tripDestinations} />}
        </div>

        {/* Display Sales Staff Information */}
        <div className="right-side">
          {tripData.saleStaff ? (
            <SingleSalesStaffData salesData={tripData} />
          ) : (
            <div>No sales staff data available.</div>
          )}
        </div>
      </div>

      <div className="button-group">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
}

export default OnGoingPage;
