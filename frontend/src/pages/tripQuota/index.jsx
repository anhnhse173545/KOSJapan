
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.scss';

function CompleteTripPage() {
  const { id } = useParams(); // Get booking ID from URL
  const navigate = useNavigate();

  // State for trip data
  const [tripData, setTripData] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [errorTrip, setErrorTrip] = useState(null);
  const [errorReject, setErrorReject] = useState(null); // Error handling for reject action
  const [errorPay, setErrorPay] = useState(null); // Error handling for pay action

  // Fetch trip data based on the ID from the URL
  useEffect(() => {
    fetch(`http://localhost:8080/api/booking/get/${id}`)
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

  // Handle reject (change status to "Canceled")
  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/booking/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...tripData, status: 'Canceled' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update trip status in state
      const updatedTrip = await response.json();
      setTripData(updatedTrip);
    } catch (error) {
      setErrorReject('Error rejecting the trip: ' + error.message);
    }
  };

  // Handle pay (change status to "Paid Booking" and navigate to /paykoi/${id})
  const handlePay = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/booking/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...tripData, status: 'Paid Booking' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // If the status update is successful, navigate to the payment page
      navigate(`/paykoi/${id}`);
    } catch (error) {
      setErrorPay('Error processing the payment: ' + error.message);
    }
  };

  // Loading and error handling for both APIs
  if (loadingTrip) {
    return <div>Loading data...</div>;
  }

  if (errorTrip) {
    return <div>Error loading trip data: {errorTrip.message}</div>;
  }

  return (
    <div className="complete-trip-page">
      <h2>Booking Details for ID: {id}</h2>

      <div className="details-container">
        {/* Display Customer Information */}
        <div className="section">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {tripData.customer.name}</p>
          <p><strong>Email:</strong> {tripData.customer.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {tripData.customer.phone || 'N/A'}</p>
          <p><strong>Description:</strong> {tripData.description}</p>
          <p><strong>Created At:</strong> {tripData.createAt}</p>
        </div>

        {/* Display Sales Staff Information */}
        {tripData.saleStaff ? (
          <div className="section">
            <h3>Sales Staff Information</h3>
            <p><strong>ID:</strong> {tripData.saleStaff.id}</p>
            <p><strong>Name:</strong> {tripData.saleStaff.name}</p>
            <p><strong>Email:</strong> {tripData.saleStaff.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {tripData.saleStaff.phone || 'N/A'}</p>
          </div>
        ) : (
          <div className="section">No sales staff information available.</div>
        )}

        {/* Display Trip Details */}
        {tripData.trip ? (
          <div className="section">
            <h3>Trip Information</h3>
            <p><strong>Trip ID:</strong> {tripData.trip.id}</p>
            <p><strong>Start Date:</strong> {tripData.trip.startDate}</p>
            <p><strong>End Date:</strong> {tripData.trip.endDate}</p>
            <p><strong>Departure Airport:</strong> {tripData.trip.departureAirport}</p>
            <p><strong>Description:</strong> {tripData.trip.description || 'N/A'}</p>
            <p><strong>Price:</strong> ${tripData.trip.price}</p>
            <p><strong>Status:</strong> {tripData.trip.status}</p>
          </div>
        ) : (
          <div className="section">No trip information available.</div>
        )}

        {/* Display Itinerary (Trip Destinations) */}
        {tripData.tripDestinations && tripData.tripDestinations.length > 0 ? (
          <div className="section">
            <h3>Itinerary</h3>
            {tripData.tripDestinations.map((destination, index) => (
              <div key={index} className="itinerary-day">
                <h4>Day {index + 1}</h4>
                <p><strong>Visit Date:</strong> {destination.visitDate || 'N/A'}</p>
                <p><strong>Farm Name:</strong> {destination.farm.name}</p>
                <p><strong>Farm Address:</strong> {destination.farm.address}</p>

                <div className="koi-varieties">
                  <h5>Koi Varieties:</h5>
                  {destination.farm.varieties && destination.farm.varieties.length > 0 ? (
                    destination.farm.varieties.map((variety, varIndex) => (
                      <div key={varIndex} className="koi-variety">
                        <p><strong>Variety:</strong> {variety.name}</p>
                        <p><strong>Description:</strong> {variety.description}</p>
                      </div>
                    ))
                  ) : (
                    <p>No koi varieties available for this farm.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="section">No itinerary data available.</div>
        )}
      </div>

      <div className="button-group">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>

        {/* Pay Button */}
        <button className="back-button" onClick={handlePay}>Pay</button>

        {/* Reject Button */}
        <button className="back-button" onClick={handleReject}>Reject</button>

        {/* Error Messages if Actions Fail */}
        {errorReject && <p className="error-message">{errorReject}</p>}
        {errorPay && <p className="error-message">{errorPay}</p>}
      </div>
    </div>
  );
}

export default CompleteTripPage;
