import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.scss';

// Sample koiPayments data (you'll use the actual one)
const koiPayments = [
  {
    id: 2,
    name: 'Nguyen Hoang minh',
    farm: 'Matsue Nishikigoi Center',
    time: 'Time Start: 9/19/2024',
    quantity: 2,
    status: 'Pending Quota',
    price: '$400.00',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuK5Sz8ToO0Sz50esp9c-QAu_w71BHtKJLEA&s',
    statusLabel: 'Pending Quota | Waiting',
    email: 'minh@gmail.com',
    phone: '0981918818',
    numberOfPeople: 2,
    startDate: '2024-09-19',
    endDate: '2024-09-25',
    address: '123-123 Ho Chi minh City',
    itinerary: [
      { day: 'Day 1', farm: 'Farm A', koi: ['Koi 1', 'Koi 2'] },
      { day: 'Day 2', farm: 'Farm B', koi: ['Koi 3', 'Koi 4'] },
    ],
  },
 
];

function QuotaDetailsPage() {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();

  // Find the payment details based on the ID
  const paymentDetails = koiPayments.find((payment) => payment.id === parseInt(id));

  if (!paymentDetails) return <div>Order not found</div>;

  const handlePay = () => {
    // Logic to handle payment
    alert('Proceed to Payment');
    // You can redirect to the payment page or handle payment logic here
    navigate('/paykoi'); // Example route to payment page
  };

  const handleReject = () => {
    // Logic to handle rejection
    alert('Quote Rejected');
    navigate('/payment'); // Redirect to payment list after rejection
  };

  return (
    <div className="quota-details-page">
      <h2>Trip Details for Quotation ID: {paymentDetails.id}</h2>
      <img src={paymentDetails.img} alt={paymentDetails.img} className="koi-image" />
      <p ><strong>Name:</strong> {paymentDetails.name}</p>
        <p><strong>Email:</strong> {paymentDetails.email}</p>
        <p><strong>Phone:</strong> {paymentDetails.phone}</p>
        <p><strong>Start Date:</strong> {paymentDetails.startDate}</p>
        <p><strong>End Date:</strong> {paymentDetails.endDate}</p>
        <p><strong>Address:</strong> {paymentDetails.address}</p>
        
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
