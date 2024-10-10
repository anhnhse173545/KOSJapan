
import { useParams, useNavigate } from 'react-router-dom';
import "./index.scss";


const koiPayments = [
    {
        id: 1,
        name: 'Nguyen Hoang Minh  ',
        status: 'Request',
        price: '$400.00',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOxfoK9Pk6FKjHPQrqVj8SUHJIohxdxkK1Iw&s',
        statusLabel: 'Request | Pending Approval',
        email: 'minh@gmail.com',
        phone: '0981918818',  
        koiDescription:'hihihaha',
        tripdescription:'hahahii',
        otherrequirements:'otherrerer',
        startDate: '2024-09-19',
        endDate: '2024-09-25',
        address: '123-123 Ho Chi minh City',
        destination: 'Dainichi Koi Farm',
      },
      {
        id: 2,
        farm: 'Matsue Nishikigoi Center',
        time: 'Time Start: 9/19/2024',
        quantity: 2,
        status: 'Pending Quota',
        price: '$400.00',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuK5Sz8ToO0Sz50esp9c-QAu_w71BHtKJLEA&s',
        statusLabel: 'Pending Quota | Waiting',
        email: 'minh@gmail.com',
        phone: '0981918818',
        numberOfPeople: 2,
        startDate: '2024-09-19',
        endDate: '2024-09-25',
        address: '123-123 Ho Chi minh City',
        destination: 'Matsue Nishikigoi Center',
        koiDescription:'hihihaha',
        tripdescription:'hahahii',
        otherrequirements:'otherrerer',
      },
      {
        id: 3,
        farm: 'Dainichi Koi Farm',
        time: 'Time Start: 9/19/2024',
        quantity: 1,
        status: 'Completed',
        price: '$400.00',
        img: 'https://i.ytimg.com/vi/pUADEpL3DNM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA3nCkTx9J7kqjMCIk6ImhQ7ih5iw',
        statusLabel: 'Completed | Delivery Completed',
        email: 'minh@gmail.com',
        phone: '0981918818',
        numberOfPeople: 2,
        startDate: '2024-09-19',
        endDate: '2024-09-25',
        address: '123-123 Ho Chi minh City',
        destination: 'Dainichi Koi Farm',
        koiDescription:'hihihaha',
        tripdescription:'hahahii',
        otherrequirements:'otherrerer',
      },
      {
        id: 4,
        farm: 'Otsuka Koi Farm',
        time: 'Time Start: 9/19/2024',
        status: 'Canceled',
        price: '$900.00',
        img: 'https://onkoi.vn/wp-content/uploads/2020/04/Ho-nuoi-Koi-can-phai-co-kich-thuoc-lon-va-rong-rai.jpg',
        statusLabel: 'Canceled | Order Canceled',
        email: 'minh@gmail.com',
        phone: '0981918818',
        numberOfPeople: 2,
        startDate: '2024-09-19',
        endDate: '2024-09-25',
        address: '123-123 Ho Chi minh City',
        destination: 'Otsuka Koi Farm',
        koiDescription:'hihihaha',
        tripdescription:'hahahii',
        otherrequirements:'otherrerer',
      },
];

function PaymentDetailsPage() {
  const { id } = useParams(); // Lấy ID từ URL để xác định đơn hàng nào được chọn
  const navigate = useNavigate();

  // Lấy thông tin chi tiết của đơn hàng dựa trên ID
  const paymentDetails = koiPayments.find((payment) => payment.id === parseInt(id));

  if (!paymentDetails) return <div>Order not found</div>;

  return (
    <div className="payment-details-page">
      <h2>Payment Details for Order ID: {paymentDetails.id}</h2>
      <div className="details-container">
      <p><strong>Name:</strong> {paymentDetails.name}</p>
        <p><strong>Email:</strong> {paymentDetails.email}</p>
        <p><strong>Phone:</strong> {paymentDetails.phone}</p>
        <p><strong>Koi Descriptopn:</strong> {paymentDetails.koiDescription}</p>
        <p><strong>Trip Description:</strong> {paymentDetails.tripdescription}</p>
        <p><strong>Other Requirements:</strong> {paymentDetails.otherrequirements}</p>
        <p><strong>Start Date:</strong> {paymentDetails.startDate}</p>
        <p><strong>End Date:</strong> {paymentDetails.endDate}</p>
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default PaymentDetailsPage;
