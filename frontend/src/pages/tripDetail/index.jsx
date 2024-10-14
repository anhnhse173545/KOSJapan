import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./index.scss";

function PaymentDetailsPage() {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payment details from API
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/trip/get/${id}/customer-sale`); // Replace with your API URL
        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }
        const data = await response.json();
        setPaymentDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [id]); // Dependency array ensures this runs when `id` changes

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If paymentDetails is still null (though it shouldn't be if fetching is successful)
  if (!paymentDetails) {
    return <div>Order not found</div>;
  }

  return (
    <div className="payment-details-page">
      <h2>Payment Details for Order ID: {paymentDetails.id}</h2>
      <div className="details-container">
        <img src={paymentDetails.img} alt={paymentDetails.name} className="payment-image" />
        <p><strong>Name:</strong> {paymentDetails.customer.name}</p>
        <p><strong>Email:</strong> {paymentDetails.customer.email}</p>
        <p><strong>Phone:</strong> {paymentDetails.customer.phone}</p>
        <p><strong>Description:</strong> {paymentDetails.customer.description}</p>
        <p><strong>Start Date:</strong> {paymentDetails.startDate}</p>
        <p><strong>End Date:</strong> {paymentDetails.endDate}</p>
        <p><strong>Status:</strong> {paymentDetails.status}</p>
        
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default PaymentDetailsPage;
