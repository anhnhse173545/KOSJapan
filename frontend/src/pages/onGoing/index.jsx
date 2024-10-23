import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ongoing.scss';

function CompleteTripPage() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  // State cho dữ liệu chuyến đi
  const [tripData, setTripData] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [errorTrip, setErrorTrip] = useState(null);
  const [errorReject, setErrorReject] = useState(null); // Xử lý lỗi cho hành động từ chối
  const [errorPay, setErrorPay] = useState(null); // Xử lý lỗi cho hành động thanh toán

  // Fetch dữ liệu chuyến đi dựa trên ID từ URL
  useEffect(() => {
    fetch(`http://localhost:8080/api/booking/get/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTripData(data);
        setLoadingTrip(false);
      })
      .catch((error) => {
        setErrorTrip(error);
        setLoadingTrip(false);
      });
  }, [id]);

  // Hàm từ chối (thay đổi trạng thái thành "Canceled")

  // Hàm để render chi tiết đơn đặt hàng cá
  const renderFishOrderDetails = (fishOrderDetails) => (
    <div className="fish-order-section">
      <h3>Fish Orders</h3>
      {fishOrderDetails.map((order) => (
        <div key={order.id} className="fish-order">
          <h4>Order ID: {order.id}</h4>
          {order.fishOrderDetails.map((detail) => (
            <div key={detail.id}>
              <p><strong>Fish Variety:</strong> {detail.fish.variety.name}</p>
              <p><strong>Description:</strong> {detail.fish.description}</p>
              <p><strong>Length:</strong> {detail.fish.length} cm</p>
              <p><strong>Weight:</strong> {detail.fish.weight} kg</p>
              <p><strong>Price:</strong> ${detail.fish_price}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  // Hàm để render chi tiết gói cá
  const renderFishPackOrderDetails = (fishPackOrderDetails) => (
    <div className="fish-pack-order-section">
      <h3>Fish Pack Orders</h3>
      {fishPackOrderDetails.map((pack) => (
        <div key={pack.id}>
          <h4>Fish Pack ID: {pack.id}</h4>
          <p><strong>Description:</strong> {pack.fishPack.description}</p>
          <p><strong>Quantity:</strong> {pack.fishPack.quantity}</p>
          <p><strong>Price:</strong> ${pack.price}</p>
        </div>
      ))}
    </div>
  );

  // Kiểm tra trạng thái loading và lỗi
  if (loadingTrip) {
    return <div>Loading data...</div>;
  }

  if (errorTrip) {
    return <div>Error loading trip data: {errorTrip.message}</div>;
  }

  return (
    <div className="complete-trip-page">
      <h2>Booking Details for ID: {id}</h2>

      <div className="details-container">
        {/* Thông tin khách hàng */}
        <div className="section">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> {tripData.customer.name}</p>
          <p><strong>Email:</strong> {tripData.customer.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {tripData.customer.phone || 'N/A'}</p>
          <p><strong>Description:</strong> {tripData.description}</p>
          <p><strong>Created At:</strong> {new Date(tripData.createAt).toLocaleString()}</p>
        </div>

        {/* Thông tin nhân viên bán hàng */}
        {tripData.saleStaff ? (
          <div className="section">
            <h3>Sales Staff Information</h3>
            <p><strong>ID:</strong> {tripData.saleStaff.id}</p>
            <p><strong>Name:</strong> {tripData.saleStaff.name}</p>
            <p><strong>Email:</strong> {tripData.saleStaff.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {tripData.saleStaff.phone || 'N/A'}</p>
          </div>
        ) : (
          <div className="section">No sales staff information available.</div>
        )}


        {tripData.consultingStaff ? (
          <div className="section">
            <h3>Consulting Staff Information</h3>
            <p><strong>ID:</strong> {tripData.saleStaff.id}</p>
            <p><strong>Name:</strong> {tripData.saleStaff.name}</p>
            <p><strong>Email:</strong> {tripData.saleStaff.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {tripData.saleStaff.phone || 'N/A'}</p>
          </div>
        ) : (
          <div className="section">No Consulting staff information available.</div>
        )}


        {/* Thông tin chuyến đi */}
        {tripData.trip ? (
          <div className="section">
            <h3>Trip Information</h3>
            <p><strong>Trip ID:</strong> {tripData.trip.id}</p>
            <p><strong>Start Date:</strong> {new Date(tripData.trip.startDate).toLocaleString()}</p>
            <p><strong>End Date:</strong> {new Date(tripData.trip.endDate).toLocaleString()}</p>
            <p><strong>Departure Airport:</strong> {tripData.trip.departureAirport}</p>
            <p><strong>Description:</strong> {tripData.trip.description || 'N/A'}</p>
            <p><strong>Price:</strong> ${tripData.trip.price}</p>
            <p><strong>Status:</strong> {tripData.trip.status}</p>
          </div>
        ) : (
          <div className="section">No trip information available.</div>
        )}

        {/* Lịch trình (Điểm đến chuyến đi) */}
        {tripData.trip.tripDestinations && tripData.trip.tripDestinations.length > 0 ? (
          <div className="section">
            <h3>Itinerary</h3>
            {tripData.trip.tripDestinations.map((destination, index) => (
              <div key={index} className="itinerary-day">
                <h4>Destination {index + 1}</h4>
                <p><strong>Farm Name:</strong> {destination.farm.name}</p>
                <p><strong>Farm Address:</strong> {destination.farm.address}</p>
                <p><strong>Phone Number:</strong> {destination.farm.phoneNumber || 'N/A'}</p>

                <div className="varieties">
                  <h5>Koi Varieties:</h5>
                  {destination.farm.varieties && destination.farm.varieties.length > 0 ? (
                    destination.farm.varieties.map((variety) => (
                      <div key={variety.id}>
                        <p><strong>Variety:</strong> {variety.name}</p>
                        <p><strong>Description:</strong> {variety.description}</p>
                      </div>
                    ))
                  ) : (
                    <p>No koi varieties available for this farm.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="section">No itinerary data available.</div>
        )}

        {/* Hiển thị chi tiết đơn đặt hàng cá */}
        {tripData.fishOrders && tripData.fishOrders.length > 0 && (
          renderFishOrderDetails(tripData.fishOrders)
        )}

        {/* Hiển thị chi tiết gói cá */}
        {tripData.fishOrders && tripData.fishOrders.length > 0 && 
          renderFishPackOrderDetails(tripData.fishOrders.flatMap(order => order.fishPackOrderDetails))
        }
      </div>

      {/* Hiển thị thông báo lỗi nếu có */}
      {errorReject && <div className="error">{errorReject}</div>}
      {errorPay && <div className="error">{errorPay}</div>}

      {/* Nút từ chối và thanh toán */}
      <div className="action-buttons">
        
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
}

export default CompleteTripPage;
