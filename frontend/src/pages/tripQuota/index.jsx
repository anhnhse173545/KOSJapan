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

function QuotaDetailsPage() {
  const { id } = useParams();  // Lấy ID từ URL
  const navigate = useNavigate();

  // Trạng thái cho dữ liệu trip
  const [tripData, setTripData] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [errorTrip, setErrorTrip] = useState(null);

  // Trạng thái cho dữ liệu sales staff
  const [salesData, setSalesData] = useState(null);
  const [loadingSales, setLoadingSales] = useState(true);
  const [errorSales, setErrorSales] = useState(null);

  // Gọi API để lấy dữ liệu trip dựa trên ID từ URL
  useEffect(() => {
    fetch(`http://localhost:8080/api/trip/get/${id}/customer-sale`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Trip Data:', data);
        setTripData(data);
        setLoadingTrip(false);

        // Khi có dữ liệu trip, lấy ID của sales staff để gọi API sales staff
        if (id) {
          fetch(`http://localhost:8080/api/booking/${id}/list`)  // Sử dụng salesStaffId từ tripData
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((salesData) => {
              console.log('Sales Staff Data:', salesData);
              setSalesData(salesData);
              setLoadingSales(false);
            })
            .catch((error) => {
              setErrorSales(error);
              setLoadingSales(false);
            });
        } else {
          setLoadingSales(false); // Nếu không có salesStaffId thì dừng loading sales staff
        }
      })
      .catch((error) => {
        setErrorTrip(error);
        setLoadingTrip(false);
      });
  }, [id]);

  // Kiểm tra trạng thái loading và error cho cả hai API
  if (loadingTrip || loadingSales) {
    return <div>Loading data...</div>;
  }

  if (errorTrip) {
    return <div>Error loading trip data: {errorTrip.message}</div>;
  }

  if (errorSales) {
    return <div>Error loading sales staff data: {errorSales.message}</div>;
  }

  return (
    <div className="quota-details-page">
      <h2>Trip Details for Quotation ID: {id}</h2>

      <div className="customer-sales-container">
        {/* Hiển thị thông tin Trip bên trái */}
        <div className="left-side">
          {tripData && <SingleCustomerStaffData tripData={tripData} />}
        </div>

        {/* Hiển thị thông tin Sales Staff bên phải */}
        <div className="right-side">
          {salesData ? (
            <SingleSalesStaffData salesData={salesData} />
          ) : (
            <div>No sales staff data available.</div>
          )}
        </div>
      </div>

      <div className="button-group">
        <button className="pay-button" onClick={() => navigate('/paykoi')}>Pay</button>
        <button className="reject-button" onClick={() => navigate('/payment')}>Reject</button>
      </div>
    </div>
  );
}

export default QuotaDetailsPage;
