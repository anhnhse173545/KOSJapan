import { useState } from 'react';
import './index.scss'; // Import file CSS để styling
import { Link, useNavigate, useLocation } from 'react-router-dom';

const koiPayments = [
  {
    id: 1,
    name: 'Kohaku Koi Farm',
    koi: 'Showa - koi #S0508b066',
    size: 15,
    quantity: 1,
    status: 'Pending Payment',
    price: '$400.00',
    img: 'https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg',
    gender: 'Male',
    height: '30 cm',
    weight: '1.5 kg',
    farm: 'Kohaku Koi Farm',
  },
  {
    id: 2,
    name: 'Kohaku Koi Farm',
    koi: 'Kohaku - koi #K0508b066',
    size: 18,
    quantity: 2,
    status: 'Transit',
    price: '$400.00',
    img: 'https://hanoverkoifarms.com/wp-content/uploads/2017/01/great-kohaku-739x1024.jpg',
    gender: 'Female',
    height: '32 cm',
    weight: '1.7 kg',
    farm: 'Kohaku Koi Farm',
  },
  {
    id: 3,
    name: 'Kohaku Koi Farm',
    koi: 'Kohaku - koi #K0508b066',
    size: 18,
    quantity: 2,
    status: 'Completed',
    price: '$400.00',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVB8GmzfJjVFuNXYAYwtY74c9iY3xRbQ3Hlw&s',
    gender: 'Female',
    height: '12 cm',
    weight: '1.7 kg',
    farm: 'Kohaku Koi Farm',
  },
  {
    id: 4,
    name: 'Kohaku Koi Farm',
    koi: 'Kohaku - koi #K0508b066',
    size: 18,
    quantity: 5,
    status: 'Canceled',
    price: '$400.00',
    img: 'https://cdn.shopify.com/s/files/1/1083/2612/files/koi6_480x480.jpg?v=1719302648',
    gender: 'Male',
    height: '13 cm',
    weight: '1.7 kg',
    farm: 'Kohaku Koi Farm',
  },
];

function KoiPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredPayments = koiPayments.filter((payment) =>
    selectedStatus === 'All' ? true : payment.status === selectedStatus
  );

  return (
    <div className="payment-page-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <ul>
          <li>
            <Link to="/profile" className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}>My Profile</Link>
          </li>
          <li>
            <Link to="/payment" className={`sidebar-link ${location.pathname === '/payment' ? 'active' : ''}`}>My Trip</Link>
          </li>
          <li>
            <Link to="/mykoi" className={`sidebar-link ${location.pathname === '/mykoi' ? 'active' : ''}`}>My Koi</Link>
          </li>
         
        </ul>
      </div>

      {/* Phần hiển thị thanh tabs để lọc */}
      <div className="payment-section">
        <div className="status-tabs">
          <button className={`tab ${selectedStatus === 'All' ? 'active' : ''}`} onClick={() => setSelectedStatus('All')}>
            All
          </button>
          <button className={`tab ${selectedStatus === 'Pending Payment' ? 'active' : ''}`} onClick={() => setSelectedStatus('Pending Payment')}>
            Pending Payment
          </button>
          <button className={`tab ${selectedStatus === 'Transit' ? 'active' : ''}`} onClick={() => setSelectedStatus('Transit')}>
            Transit
          </button>
          <button className={`tab ${selectedStatus === 'Completed' ? 'active' : ''}`} onClick={() => setSelectedStatus('Completed')}>
            Completed
          </button>
          <button className={`tab ${selectedStatus === 'Canceled' ? 'active' : ''}`} onClick={() => setSelectedStatus('Canceled')}>
            Canceled
          </button>
        </div>

        {/* Phần hiển thị danh sách các payment dựa trên bộ lọc */}
        <div className="payment-list">
          {filteredPayments.map((koi) => (
            <div key={koi.id} className="payment-item">
              <img src={koi.img} alt={koi.koi} className="koi-image" />
              <div className="payment-details">
                <h3>{koi.name}</h3>
                <p>{koi.koi}</p>
                {koi.quantity && <p>Quantity: {koi.quantity}</p>}
                {koi.size && <p>Size: {koi.size} cm</p>}
                <p className="status">{koi.status}</p>
                <p className="price">{koi.price}</p>
                
                {koi.status === 'Pending Payment' ? (
                  <button
                    className="details-button"
                    onClick={() => navigate(`/paykoi`)} 
                  >
                    Purchase
                  </button>
                ) : (
                  <button
                    className="details-button"
                    onClick={() => navigate(`/mykoi/${koi.id}`)} 
                    
                    
                  >
                    See Details
                    
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KoiPage;
