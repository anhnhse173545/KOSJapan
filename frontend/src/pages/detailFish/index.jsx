import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './detail.css';

function KoiDetailPage() {
  const { id } = useParams();
  const [koi, setKoi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const koiImages = [
    'https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcYR8TZ9R0bWOZrBIx-TJgw7VjeYfgfRvrBIvxKxzTL13pPx5gaW4phyt0ZWvHc0AdAO8&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAHjvobHvucSmw9JochLMhfjX-XpCvXf3hQO_nQpawKrlqWnd3nEjk4qrCQRRjgVOfNc0&usqp=CAU',
    'https://static.chotot.com/storage/chotot-kinhnghiem/c2c/2021/04/92de3bb8-ca-koi-showa.png',
  ];

  const fishPackImages = [
    'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2019/9/16/754896/Tha-Ca-To-Lich-3.jpg',
    'https://static.kinhtedothi.vn/w960/images/upload/2021/12/25/img-2145.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqRY_xhjwTbr8jl8o-rB2GwlvKLKPOG0rMKgNNhl91T63-4-8ei5mGNT8kALKanlYXD8c&usqp=CAU',
    'https://traicagiong.com/wp-content/uploads/2023/03/nhu-the-nao-la-koi-viet.jpg',
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * koiImages.length);
    return koiImages[randomIndex];
  };

  const getRandomPackImage = () => {
    const randomIndex = Math.floor(Math.random() * fishPackImages.length);
    return fishPackImages[randomIndex];
  };

  useEffect(() => {
    const fetchKoi = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/fish-order/customer/AC0007`);
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

  if (!koi.length) {
    return <div>Koi not found</div>;
  }

  return (
    <div className="koi-detail-page">
      <h1>Fish Order Details</h1>

      {koi.map(order => (
        <div key={order.id} className="fish-order-details">
          <br />
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Delivery Address:</strong> {order.deliveryAddress || 'No address provided'}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> {order.total} VND</p>
          {/* Hiển thị nút Purchase nếu trạng thái là Pending */}
          {order.status === 'Pending' && (
            <button 
              className="purchase-button" 
              onClick={() => navigate(`/paykoi50/${order.id}`)}
            >
              Purchase
            </button>
          )}
        
          {/* Hiển thị chi tiết cá trong đơn hàng */}
          {order.fishOrderDetails.map(orderDetail => (
            <div key={orderDetail.id} className="fish-detail">
              <img 
                src={getRandomImage()} 
                alt={orderDetail.fish.fish_variety_name} 
                className="koi-image" 
              />
              <p><strong>Fish ID:</strong> {orderDetail.fish.fish_id}</p>
              <p><strong>Variety:</strong> {orderDetail.fish.fish_variety_name}</p>
              <p><strong>Description:</strong> {orderDetail.fish.description}</p>
              <p><strong>Length:</strong> {orderDetail.fish.length} cm</p>
              <p><strong>Weight:</strong> {orderDetail.fish.weight} kg</p>
              <p><strong>Price:</strong> {orderDetail.price} VND</p>


              
            </div>
            
            
          ))}

          {/* Hiển thị chi tiết pack cá trong đơn hàng (nếu có) */}
          {order.fishPackOrderDetails.length > 0 && (
  <div className="fish-pack-detail">
    <h3>Fish Pack Details</h3>
    {order.fishPackOrderDetails.map(pack => (
      <div key={pack.id} className="pack-detail">
        <img 
          src={getRandomPackImage()} 
          alt={pack.fishPack.description} 
          className="pack-image" 
        />
        <p><strong>Pack ID:</strong> {pack.fishPack.id}</p>
        <p><strong>Description:</strong> {pack.fishPack.description}</p>
        <p><strong>Length:</strong> {pack.fishPack.length}</p>
        <p><strong>Weight:</strong> {pack.fishPack.weight}</p>
        <p><strong>Quantity:</strong> {pack.fishPack.quantity}</p>
        <p><strong>Price:</strong> {pack.price} VND</p>

        {/* Nút Purchase cho từng gói cá */}
        {order.status === 'Pending' && (
          <button 
            className="purchase-button" 
            onClick={() => alert(`Proceeding to purchase for Pack ID: ${pack.fishPack.id}`)}
          >
            Purchase
          </button>
        )}
      </div>
    ))}
  </div>
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
