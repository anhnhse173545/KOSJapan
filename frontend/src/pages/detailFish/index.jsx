import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './detail.css';

function KoiDetailPage() {
  const { id } = useParams();
  const [koi, setKoi] = useState(null);  // Chỉ lưu trữ 1 order
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const koiImages = [
    'https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcYR8TZ9R0bWOZrBIx-TJgw7VjeYfgfRvrBIvxKxzTL13pPx5gaW4phyt0ZWvHc0AdAO8&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAHjvobHvucSmw9JochLMhfjX-XpCvXf3hQO_nQpawKrlqWnd3nEjk4qrCQRRjgVOfNc0&usqp=CAU',
    'https://static.chotot.com/storage/chotot-kinhnghiem/c2c/2021/04/92de3bb8-ca-koi-showa.png',
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * koiImages.length);
    return koiImages[randomIndex];
  };

  useEffect(() => {
    const fetchKoi = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/fish-order/customer/AC0007`);
        const order = response.data.find(order => order.id === id);  // Lấy đơn hàng theo id từ URL
        if (order) {
          setKoi(order);  // Lưu trữ đơn hàng cụ thể
        } else {
          setError('Koi order not found');
        }
      } catch (err) {
        setError('Failed to load data');
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
      <h1>Koi Detail</h1>
  
      {/* Hiển thị thông tin chi tiết cho cá koi đầu tiên trong đơn hàng */}
      {koi.fishOrderDetails.map(orderDetail => (
        <div key={orderDetail.fish.fish_id} className="fish-detail">
          <img 
            src={getRandomImage()} 
            alt={orderDetail.fish.fish_variety_name} 
            className="koi-image" 
          />
          <p><strong>Koi ID:</strong> {orderDetail.fish.fish_id}</p>
          <p><strong>Giống cá:</strong> {orderDetail.fish.fish_variety_name}</p>
          <p><strong>Chiều dài:</strong> {orderDetail.fish.length} cm</p>
          <p><strong>Trọng lượng:</strong> {orderDetail.fish.weight} kg</p>
          <p><strong>Mô tả:</strong> {orderDetail.fish.description}</p>
          <p><strong>Giá:</strong> ${orderDetail.price}</p>
  
          {/* Hiển thị nút Purchase nếu trạng thái là Pending */}
          {koi.paymentStatus === 'Pending' && (
            <button 
              className="purchase-button" 
              onClick={() => navigate(`/paykoi50/${koi.id}`)}
            >
              Purchase
            </button>
          )}
  
          {/* Hiển thị nút Finish Payment nếu trạng thái là Delivering */}
          {koi.paymentStatus === 'Delivering' && (
            <button 
              className="purchase-button" 
              onClick={() => navigate(`/paykoi100/${koi.id}`)}
            >
              Finish Payment
            </button>
          )}
        </div>
      ))}
  
      <Link to="/mykoi" className="back-button">
        Back
      </Link>
    </div>
  );
}

export default KoiDetailPage;
