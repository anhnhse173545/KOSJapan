import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './booking.scss'; // Import CSS file for styling

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [payments, setPayments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/booking/customer/AC0007'); // Sử dụng bookingId cố định
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data); // Set the fetched payments data
      } catch (error) {
        setError(error.message); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false when finished
      }
    };

    fetchPayments();
  }, []);

  // Filter payments based on selected status
  const filteredPayments = payments.filter((payment) =>
    selectedStatus === 'All' ? true : payment.status === selectedStatus
  );

  return (
    <div className="payment-page-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <ul>
          <li>
            <Link to="/userDetail" className={`sidebar-link ${location.pathname === '/userDetail' ? 'active' : ''}`}>
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
          {['All', 'Requested', 'Approved Quote','Paid Booking','On-going','Order Prepare', 'Completed', 'Canceled'].map((status) => (
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
          {loading && <p>Loading...</p>} {/* Show loading state */}
          {error && <p className="error">{error}</p>} {/* Show error state */}
          {!loading && !error && filteredPayments.length === 0 && <p>No payments found.</p>} {/* No payments message */}
          {filteredPayments.map((koi) => (
            <div key={koi.id} className="payment-item">
              
              <div className="payment-details">
                <h3>Booking Id :{koi.id}</h3>
                <p>{koi.startDate}</p>
                <p>Create At : {koi.createAt}</p>
                <p className="status">{koi.status}</p>
                <img src={"https://a1.cdn.japantravel.com/photo/12865-215185/1440x960!/tokyo-tokyo-prefecture-215185.jpg"} alt="Koi Image" style={{ width: "200px", height: "auto" }} />

                <div className="button-group">
                  <button
                    className="details-button"
                    onClick={() => {
                      if (koi.status === 'Approved Quote') {
                        navigate(`/quota/${koi.id}`);
                      } else if (koi.status === 'Request') {
                        navigate(`/request/${koi.id}`);
                      } else if (koi.status === 'On-going') {
                        navigate(`/ongoing/${koi.id}`);
                      } else if (koi.status === 'Completed') {
                        navigate(`/ongoing/${koi.id}`);
                      } else if (koi.status === 'Paid Booking') {
                        navigate(`/ongoing/${koi.id}`);
                      } else if (koi.status === 'Order Prepare') {
                        navigate(`/ongoing/${koi.id}`);
                      } else {
                        navigate(`/request/${koi.id}`);
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
