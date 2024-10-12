import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.scss';

// Component để hiển thị thông tin của Trip
const SingleCustomerStaffData = ({ tripData }) => {
  return (
    <div className="customer-data">
      <h2>Trip Details</h2>
      <div className="customer-data-card">
        <h3>Name: {tripData.name}</h3>
        <p><strong>Email:</strong> {tripData.email}</p>
        <p><strong>Phone:</strong> {tripData.phone}</p>
        <p><strong>Koi Description:</strong> {tripData.koidescription}</p>
        <p><strong>Trip Description:</strong> {tripData.tripdescription}</p>
        <p><strong>Start Date:</strong> {tripData.startdate}</p>
        <p><strong>End Date:</strong> {tripData.enddate}</p>
      </div>
    </div>
  );
};

// Component để hiển thị thông tin của Sales Staff
const SingleSalesStaffData = ({ salesData }) => {
  return (
    <div className="sales-staff-data">
      <h2>Sales Staff Information</h2>
      <div className="staff-data-card">
        <h3>Trip: {salesData.tripDescription}</h3>
        <p><strong>Airport:</strong> {salesData.airport}</p>
        <p><strong>Sales Representative:</strong> {salesData.salesRep}</p>
        <p><strong>Benefits:</strong> {salesData.benefits}</p>
        <p><strong>Terms:</strong> {salesData.terms}</p>
        <p><strong>Additional Info:</strong> {salesData.additionalInfo}</p>
      </div>

      <div className="trip-details">
        <div className="day-detail">
          <h3>{salesData.day}</h3>
          <p><strong>Farm:</strong> {salesData.farm}</p>
          <p><strong>Koi:</strong> {salesData.koi}</p>
          <p><strong>img:</strong> {salesData.img}</p>
        </div>
      </div> 
    </div>
  );
};

function onGoingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [tripData, setTripData] = useState(null);
    const [loadingTrip, setLoadingTrip] = useState(true);
    const [errorTrip, setErrorTrip] = useState(null);
  
    const [salesData, setSalesData] = useState(null);
    const [loadingSales, setLoadingSales] = useState(true);
    const [errorSales, setErrorSales] = useState(null);
  
    useEffect(() => {
      fetch(`https://670857d88e86a8d9e42eb866.mockapi.io/api/v1/trip/${id}`)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          setTripData(data);
          setLoadingTrip(false);
  
          if (id) {
            fetch(`https://6704ec62031fd46a830de9fb.mockapi.io/api/v1/sales/${id}`)
              .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
              })
              .then((salesData) => {
                setSalesData(salesData);
                setLoadingSales(false);
              })
              .catch((error) => {
                setErrorSales(error);
                setLoadingSales(false);
              });
          } else {
            setLoadingSales(false);
          }
        })
        .catch((error) => {
          setErrorTrip(error);
          setLoadingTrip(false);
        });
    }, [id]);
  
    if (loadingTrip || loadingSales) return <div>Loading data...</div>;
    if (errorTrip) return <div>Error loading trip data: {errorTrip.message}</div>;
    if (errorSales) return <div>Error loading sales staff data: {errorSales.message}</div>;
  
    return (
      <div className="quota-details-page">
        <h2>Trip Details for Quotation ID: {id}</h2>
  
        <div className="customer-sales-container">
          <div className="left-side">
            {tripData && <SingleCustomerStaffData tripData={tripData} />}
          </div>
          <div className="right-side">
            {salesData ? <SingleSalesStaffData salesData={salesData} /> : <div>No sales staff data available.</div>}
          </div>
        </div>
  
        <div className="button-group">
          <button className="pay-button" onClick={() => navigate('/paykoi')}>Pay</button>
          <button className="reject-button" onClick={() => navigate('/payment')}>Reject</button>
        </div>
      </div>
    );
  }

  

export default onGoingPage;
