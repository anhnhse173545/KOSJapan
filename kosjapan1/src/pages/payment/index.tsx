import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './index.scss'; // Import CSS file for styling

const koiPayments = [
  {
    id: 1,
    farm: 'Dainichi Koi Farm',
    time: 'Time Start: 9/19/2024',
    quantity: 1,
    status: 'Request',
    price: '$400.00',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOxfoK9Pk6FKjHPQrqVj8SUHJIohxdxkK1Iw&s',
    statusLabel: 'Request | Pending Approval',
    email: 'minh@gmail.com',
    phone: '0981918818',
    numberOfPeople: 2,
    startDate: '2024-09-19',
    endDate: '2024-09-25',
    address: '123-123 Ho Chi minh City',
    destination: 'Nishikigoi Museum',
  },
  {
    id: 2,
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
    destination: 'Nishikigoi Museum',
  },
  {
    id: 3,
    farm: 'Dainichi Koi Farm',
    time: 'Time Start: 9/19/2024',
    quantity: 1,
    status: 'Completed',
    price: '$400.00',
    img: 'https://i.ytimg.com/vi/pUADEpL3DNM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA3nCkTx9J7kqjMCIk6ImhQ7ih5iw',
    statusLabel: 'Completed | Delivery Completed',
    email: 'minh@gmail.com',
    phone: '0981918818',
    numberOfPeople: 2,
    startDate: '2024-09-19',
    endDate: '2024-09-25',
    address: '123-123 Ho Chi minh City',
    destination: 'Nishikigoi Museum',
  },
  {
    id: 4,
    farm: 'Otsuka Koi Farm',
    time: 'Time Start: 9/19/2024',
    status: 'On going',
    price: '$900.00',
    img: 'https://onkoi.vn/wp-content/uploads/2020/04/Ho-nuoi-Koi-can-phai-co-kich-thuoc-lon-va-rong-rai.jpg',
    statusLabel: 'Canceled | Order Canceled',
    email: 'minh@gmail.com',
    phone: '0981918818',
    numberOfPeople: 2,
    startDate: '2024-09-19',
    endDate: '2024-09-25',
    address: '123-123 Ho Chi minh City',
    destination: 'Nishikigoi Museum',
  },
];

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [payments, setPayments] = useState(koiPayments);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredPayments = payments.filter((payment) =>
    selectedStatus === 'All' ? true : payment.status === selectedStatus
  );

  const handleCancel = (id: any) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id
          ? { ...payment, status: 'Canceled', statusLabel: 'Canceled | Order Canceled' }
          : payment
      )
    );
  };

  return (
    <div className="payment-page-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <ul>
          <li>
            <Link to="/profile" className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}>
              My Profile
            </Link>
          </li>
          <li>
            <Link to="/payment" className={`sidebar-link ${location.pathname === '/payment' ? 'active' : ''}`}>
              My Trip
            </Link>
          </li>
          <li>
            <Link to="/mykoi" className={`sidebar-link ${location.pathname === '/mykoi' ? 'active' : ''}`}>
              My Koi Fish
            </Link>
          </li>
          
        </ul>
      </div>

      {/* Status Tabs */}
      <div className="payment-section">
        <div className="status-tabs">
          {['All', 'Request', 'Pending Quota','On going' ,'Completed', 'Canceled' ].map((status) => (
            <button
              key={status}
              className={`tab ${selectedStatus === status ? 'active' : ''}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Payment List */}
        <div className="payment-list">
          {filteredPayments.map((koi) => (
            <div key={koi.id} className="payment-item">
              <img src={koi.img} alt={koi.farm} className="koi-image" />
              <div className="payment-details">
                <h3>{koi.farm}</h3>
                <p>{koi.time}</p>
                {koi.quantity && <p>Quantity: {koi.quantity}</p>}
                <p className="status">{koi.statusLabel}</p>
                <p className="price">{koi.price}</p>

            
                <div className="button-group">
  <button
    className="details-button"
    onClick={() => {
      if (koi.status === 'Pending Quota') {
        navigate(`/quota/${koi.id}`);
      } else if (koi.status === 'Request') {
        navigate(`/payment/${koi.id}`);
      }else if(koi.status === 'On going'){
        navigate (`/ongoing/${koi.id}`)
      
      } else {
        navigate(`/payment/${koi.id}`);
      }
    }}
  >
    See Details
  </button>
</div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
