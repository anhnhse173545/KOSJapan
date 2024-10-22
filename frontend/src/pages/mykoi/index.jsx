import { useState, useEffect } from 'react';
import './index.scss'; // Import file CSS để styling
import { Link, useNavigate, useLocation } from 'react-router-dom';

function KoiPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [koiPayments, setKoiPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API để lấy dữ liệu koi payments
  useEffect(() => {
    const fetchKoiPayments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/fish-order/customer/AC0007`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setKoiPayments(data);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        setError('Failed to fetch koi payments');
      } finally {
        setLoading(false);
      }
    };
  
    fetchKoiPayments();
  }, []);
  

  const filteredPayments = koiPayments.filter((payment) =>
    selectedStatus === 'All' ? true : payment.status === selectedStatus
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
              My Koi
            </Link>
          </li>
        </ul>
      </div>

      {/* Phần hiển thị thanh tabs để lọc */}
      <div className="payment-section">
        <div className="status-tabs">
          <button className={`tab ${selectedStatus === 'All' ? 'active' : ''}`} onClick={() => setSelectedStatus('All')}>
            All
          </button>
          <button className={`tab ${selectedStatus === 'Pending' ? 'active' : ''}`} onClick={() => setSelectedStatus('Pending')}>
          Pending
          </button>
          <button className={`tab ${selectedStatus === 'Deposited' ? 'active' : ''}`} onClick={() => setSelectedStatus('Deposited')}>
          Deposited
          </button>
          <button className={`tab ${selectedStatus === 'In Transit' ? 'active' : ''}`} onClick={() => setSelectedStatus('In Transit')}>
          In Transit
          </button>
          <button className={`tab ${selectedStatus === 'Delivering' ? 'active' : ''}`} onClick={() => setSelectedStatus('Delivering')}>
          Delivering
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
              <img src={koi.img || 'https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg'} alt={koi.koi} className="koi-image" />
              <div className="payment-details">
                <h3>{koi.name}</h3>
                <p>{koi.koi}</p>
                {koi.quantity && <p>Quantity: {koi.quantity}</p>}
                {koi.size && <p>Size: {koi.size} cm</p>}
                <p className="Id Trip">Koi ID: {koi.id}</p>
                <p className="Id Farm">Farm ID: {koi.farmId}</p>
                <p className="status">Status: {koi.status}</p>
                <p className="price">{koi.price}</p>

                {koi.status === 'Pending' ? (
                  <button
                    className="details-button"
                    onClick={() => navigate(`/mykoi/${koi.id}`)}
                  >
                    See Details
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
