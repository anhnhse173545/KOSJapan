import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentTripPage = () => {
  const { orderId } = useParams(); // Lấy order ID từ URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Để điều hướng

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Gọi API để tạo thanh toán
      const response = await axios.post(`http://localhost:8080/${orderId}/payment/api/create-fishpayment`);

      // Lấy URL chuyển hướng từ phản hồi
      const { approvalUrl } = response.data;

      // Chuyển hướng đến PayPal
      window.location.href = approvalUrl;
    } catch (err) {
      setError('Failed to create payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-trip-page">
      <h1>Payment for Order ID: {orderId}</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handlePayment} className="payment-button">
        Proceed to PayPal
      </button>
    </div>
  );
};

export default PaymentTripPage;
