import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '@/config/api';
const RefundKoi = () => {
  const { id } = useParams(); // lấy bookingid từ URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const createRefundRequest = async () => {
      try {
        // Gửi yêu cầu POST tới API để yêu cầu hoàn tiền
        const response = await api.post(`/${id}/api/refund`);
        console.log(response.data); // Kiểm tra dữ liệu trả về từ API

        setLoading(false); // Ngừng trạng thái loading

        // Điều hướng đến trang deliveries với thông báo thành công
        navigate('/ds-dashboard/my-deliveries', {
          state: { message: "Refund successful! 🎉" }
        });
      } catch (err) {
        console.error('Có lỗi xảy ra:', err);
        setError('Có lỗi xảy ra trong quá trình xử lý yêu cầu hoàn tiền.');
        setLoading(false);
      }
    };

    createRefundRequest(); // Gọi hàm yêu cầu hoàn tiền khi component render
  }, [id, navigate]);

  // Hiển thị khi đang loading hoặc có lỗi
  if (loading) return <div>Loading Payment...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return null;
};

export default RefundKoi;
