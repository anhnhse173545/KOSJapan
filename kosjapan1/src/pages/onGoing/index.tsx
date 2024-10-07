import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const koiPayments = [
    {
      id: 4,
      name: 'Nguyen Hoang Minh',
      farm: 'Otsuka Koi Farm',
      time: 'Time Start: 9/19/2024',
      status: 'On going',
      price: '$900.00',
      img: 'https://onkoi.vn/wp-content/uploads/2020/04/Ho-nuoi-Koi-can-phai-co-kich-thuoc-lon-va-rong-rai.jpg',
      statusLabel: 'Going | On Going',
      email: 'minh@gmail.com',
      phone: '0981918818',
      numberOfPeople: 2,
      startDate: '2024-09-19',
      endDate: '2024-09-25',
      address: '123-123 Ho Chi Minh City',
      itinerary: [
        {
          day: 'Day 1',
          farm: 'Farm A',
          koi: [
            { 
              id: '1', 
              name: 'Koi A1', 
              img: 'https://i.etsystatic.com/16221531/r/il/283513/3896651157/il_570xN.3896651157_7xfk.jpg', 
              weight: '3kg', 
              size: '50cm', 
              farm: 'Farm A' 
            },
            { 
              id: '2', 
              name: 'Koi A2', 
              img: 'https://i.etsystatic.com/16221531/r/il/283513/3896651157/il_570xN.3896651157_7xfk.jpg', 
              weight: '2.5kg', 
              size: '45cm', 
              farm: 'Farm A' 
            },
          ],
        },
        {
          day: 'Day 2',
          farm: 'Farm B',
          koi: [
            
          ],
        },
      ],
    },
  ];

  const Itinerary = ({ itinerary }) => {
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
        {itinerary.map((dayDetail, index) => (
          <div key={index} className="day-detail">
            <h3>{dayDetail.day}</h3>
            <p><strong>Farm:</strong> {dayDetail.farm}</p>
  
            <button onClick={() => toggleDetails(index)}>
              {expandedDays[index] ? 'Hide Details' : 'View Details'}
            </button>
  
            {expandedDays[index] && (
              <div className="koi-details">
                {dayDetail.koi.map((koiDetail, koiIndex) => (
                  <div key={koiIndex} className="koi-item">
                    <img
                      src={koiDetail.img}
                      alt={koiDetail.name}
                      className="koi-image-small"
                    />
                    <p><strong>ID:</strong> {koiDetail.id}</p>
                    <p><strong>Name:</strong> {koiDetail.name}</p>
                    <p><strong>Weight:</strong> {koiDetail.weight}</p>
                    <p><strong>Size:</strong> {koiDetail.size}</p>
                    <p><strong>Farm:</strong> {koiDetail.farm}</p>
                    {/* Nút điều hướng tới trang chi tiết Koi */}
                    <button onClick={() => navigate(`/mykoi/${koiDetail.id}`)}>
                      View Koi Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  
  function OnGoingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const paymentDetails = koiPayments.find((payment) => payment.id === parseInt(id));
  
    if (!paymentDetails) return <div>Order not found</div>;
  
    return (
      <div className="quota-details-page">
        <h2>Trip Details for Quotation ID: {paymentDetails.id}</h2>
        <img src={paymentDetails.img} alt={paymentDetails.name} className="koi-image" />
        
        <p><strong>Name:</strong> {paymentDetails.name}</p>
        <p><strong>Email:</strong> {paymentDetails.email}</p>
        <p><strong>Phone:</strong> {paymentDetails.phone}</p>
        <p><strong>Number of People:</strong> {paymentDetails.numberOfPeople}</p>
        <p><strong>Start Date:</strong> {paymentDetails.startDate}</p>
        <p><strong>End Date:</strong> {paymentDetails.endDate}</p>
        <p><strong>Address:</strong> {paymentDetails.address}</p>
  
        {/* Itinerary component */}
        <Itinerary itinerary={paymentDetails.itinerary} />
  
        <div className="button-group">
          <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    );
  }
  
  export default OnGoingDetails;

