import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.scss';

// API URLs
const KOI_PAYMENTS_API = 'https://6704ec62031fd46a830de9fb.mockapi.io/api/v1/payments'; // API URL cho koiPayments
const SALES_STAFF_API = 'https://6704ec62031fd46a830de9fb.mockapi.io/api/v1/sales';    // API URL cho Sales Staff

// Component để hiển thị thông tin của sales staff
const SingleSalesStaffData = ({ salesStaffId, itinerary }) => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesStaffData = async () => {
      try {
        const response = await fetch(`${SALES_STAFF_API}/${salesStaffId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSalesData(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchSalesStaffData();
  }, [salesStaffId]);

  if (loading) return <div>Loading sales staff data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (!salesData) return <div>No sales staff data available.</div>;

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

      {/* Thêm phần hiển thị thông tin ngày, farm, và cá Koi */}
      <h3>Itinerary Details</h3>
      <div className="itinerary-details">
        {itinerary.map((dayDetail, index) => (
          <div key={index} className="day-detail">
            <h4>{dayDetail.day}</h4>
            <p><strong>Farm:</strong> {dayDetail.farm}</p>
            <p><strong>Koi:</strong> {dayDetail.koi.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function QuotaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`${KOI_PAYMENTS_API}/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPaymentDetails(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  if (loading) return <div>Loading payment details...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (!paymentDetails) return <div>Order not found.</div>;

  const handlePay = () => {
    alert('Proceed to Payment');
    navigate('/paykoi');
  };

  const handleReject = () => {
    alert('Quote Rejected');
    navigate('/payment');
  };

  return (
    <div className="quota-details-page">
      <h2>Trip Details for Quotation ID: {paymentDetails.id}</h2>
      <img src={paymentDetails.img} alt={paymentDetails.img} className="koi-image" />
      <div className="customer-sales-container">
        <div className="customer-info">
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> {paymentDetails.name}</p>
          <p><strong>Email:</strong> {paymentDetails.email}</p>
          <p><strong>Phone:</strong> {paymentDetails.phone}</p>
          <p><strong>Koi Description:</strong> {paymentDetails.koiDescription}</p>
          <p><strong>Trip Description:</strong> {paymentDetails.tripdescription}</p>
          <p><strong>Other Requirements:</strong> {paymentDetails.otherrequirements}</p>
          <p><strong>Start Date:</strong> {paymentDetails.startDate}</p>
          <p><strong>End Date:</strong> {paymentDetails.endDate}</p>
        </div>

        <div className="right-side">
          {/* Truyền thêm props itinerary vào SingleSalesStaffData */}
          <SingleSalesStaffData salesStaffId={paymentDetails.salesStaffId} itinerary={paymentDetails.itinerary} />
        </div>
      </div>

      <div className="trip-details">
        {paymentDetails.itinerary.map((dayDetail, index) => (
          <div key={index} className="day-detail">
            <h3>{dayDetail.day}</h3>
            <p><strong>Farm:</strong> {dayDetail.farm}</p>
            <p><strong>Koi:</strong> {dayDetail.koi.join(', ')}</p>
          </div>
        ))}
      </div>

      <div className="button-group">
        <button className="pay-button" onClick={handlePay}>Pay</button>
        <button className="reject-button" onClick={handleReject}>Reject</button>
      </div>
    </div>
  );
}

export default QuotaDetailsPage;
