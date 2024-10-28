import { useEffect, useState } from 'react';
import axios from 'axios';

const BookingHistoryPage = ({ customerId }) => {
  const [bookingHistory, setBookingHistory] = useState([]); // Store booking history
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message state

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        // Use the passed customerId prop to fetch the booking history
        const response = await axios.get(`http://localhost:8080/api/booking/customer/AC0007`);

        // Filter bookings by status: "completed" or "canceled"
        const filteredBookings = response.data.filter(booking =>
          booking.status === 'Completed' || booking.status === 'Canceled'
        );

        setBookingHistory(filteredBookings); // Set the filtered bookings to state
      } catch (err) {
        setError('Lỗi khi tải lịch sử đặt chỗ.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [customerId]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="booking-history-container">
      <h1>Lịch sử đặt chỗ của khách hàng</h1>
      {bookingHistory.length === 0 ? (
        <p>Không có lịch sử đặt chỗ nào với trạng thái đã hoàn thành hoặc đã hủy.</p>
      ) : (
        <ul>
          {bookingHistory.map((booking) => (
            <li key={booking.id}>
              <h3>Mã đặt chỗ: {booking.id}</h3>
              <p><strong>Khách hàng:</strong> {booking.customer.name} ({booking.customer.email}, {booking.customer.phone})</p>
              <p><strong>Trạng thái:</strong> {booking.status}</p>
              <p><strong>Mô tả:</strong> {booking.description}</p>
              <p><strong>Ngày tạo:</strong> {new Date(booking.createAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingHistoryPage;
