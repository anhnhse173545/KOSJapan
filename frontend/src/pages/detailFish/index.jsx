import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss';

function KoiDetailPage() {
  const { id } = useParams(); 
  const [koi, setKoi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKoi = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/booking/get/${id}`);
        setKoi(response.data);
      } catch (err) {
        setError('Koi not found or failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchKoi();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!koi) {
    return <div>Koi not found</div>;
  }

  return (
    <div className="koi-detail-page">
      <h1>Fish Order Details</h1>

      {/* Hiển thị tất cả các đơn đặt hàng */}
      {koi.fishOrders.map(order => (
        <div key={order.id} className="fish-order-details">
          <br />
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> {order.total} VND</p>
        
          {order.fishOrderDetails.map(orderDetail => (
            <div key={orderDetail.id} className="fish-detail">
              <p><strong>Fish ID:</strong> {orderDetail.fish.id}</p>
              <p><strong>Name:</strong> {orderDetail.fish.variety.name}</p>
              <p><strong>Description:</strong> {orderDetail.fish.description}</p>
              <p><strong>Length:</strong> {orderDetail.fish.length} cm</p>
              <p><strong>Weight:</strong> {orderDetail.fish.weight} kg</p>
            </div>
          ))}
        </div>
      ))}

      <Link to="/mykoi" className="back-button">
        Back
      </Link>
    </div>
  );
}

export default KoiDetailPage;
