
import './index.scss'; // Create a new CSS file for styling

const koiPayments = [
  {
    id: 1,
    farm: 'Dainichi Koi Farm',
    koi: 'Kohaku - koi #w0508b066',
    quantity: 1,
    status: 'Completed',
    price: '$400.00',
    img: '/images/kohaku.jpg',
    statusLabel: 'Delivery successful | Completed',
  },
  {
    id: 2,
    farm: 'Dainichi Koi Farm',
    koi: 'Kohaku - koi #w0508b066',
    quantity: 1,
    status: 'Pending Payment',
    price: '$400.00',
    img: '/images/kohaku.jpg',
    statusLabel: 'Waiting payment | Pending',
  },
  {
    id: 3,
    farm: 'Dainichi Koi Farm',
    koi: 'Kohaku - koi #w0508b066',
    quantity: 1,
    status: 'In Transit',
    price: '$400.00',
    img: '/images/kohaku.jpg',
    statusLabel: 'In transit | Pending',
  },
  {
    id: 4,
    farm: 'Tour from HCMC - Kyoto',
    koi: 'Kyoto - K11287w29s',
    time: 'Time Start: 9/19/2024',
    price: '$900.00',
    img: '/images/tour.jpg',
    statusLabel: 'Payment Successful | Completed',
  },
];

function PaymentPage() {
  return (
    <div className="payment-page-container">
      <div className="profile-sidebar">
        <ul>
          <li>My Profile</li>
          <li className="active">My Payment</li>
          <li>My Tour</li>
        </ul>
      </div>

      <div className="payment-section">
        <div className="status-tabs">
          <button className="tab active">All</button>
          <button className="tab">Waiting for payment</button>
          <button className="tab">Transport</button>
          <button className="tab">Completed</button>
          <button className="tab">Canceled</button>
        </div>

        <div className="payment-list">
          {koiPayments.map((koi) => (
            <div key={koi.id} className="payment-item">
              <img src={koi.img} alt={koi.koi} className="koi-image" />
              <div className="payment-details">
                <h3>{koi.farm}</h3>
                <p>{koi.koi}</p>
                {koi.quantity && <p>Quantity: {koi.quantity}</p>}
                {koi.time && <p>{koi.time}</p>}
                <p className="status">{koi.statusLabel}</p>
                <p className="price">{koi.price}</p>
                <button className="details-button">
                  {koi.status === 'Pending Payment' ? 'Purchase' : 'See Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
