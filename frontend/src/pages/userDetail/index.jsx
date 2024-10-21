import { useEffect, useState } from 'react';
import axios from 'axios';
import './ngu.css'; // Nhập tệp CSS
import { useNavigate } from 'react-router-dom';

const UserDetailPage = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/accounts/AC0007/detail`);
        setUserDetails(response.data);
      } catch (err) {
        setError('Lỗi khi tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [accountId]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-detail-container">
      <h1>Thông tin người dùng</h1>
      {userDetails && (
        <div>
          <img 
            src={userDetails.profile_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzGYOukhtzQwJiFMmFihZEqZBr1wNMkTjgQg&s"} 
            alt="Profile" 
            className="profile-image" 
          />
          <div className="user-info">
            <p><strong>ID:</strong> {userDetails.id}</p>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Phone Number:</strong> {userDetails.phone || "09819156357"}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Role:</strong> {userDetails.role}</p>
          </div>
          <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
