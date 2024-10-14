
import { Link } from 'react-router-dom';
import './index.scss'; // CSS chung cho toàn ứng dụng

function KoiPayPage() {
  return (
    <div className="fake-payment-page">
      <h1>Purchase your KOI bill</h1>
      <p>Please scan the QR code below to pay:</p>
      <img
        src="https://qrcode-gen.com/images/qrcode-default.png"
        alt="QR Code"
        className="qr-image"
      />
      
      <p>After scanning the code, your order will be processed!</p>

      {/* Nút để quay lại trang chính hoặc trang thanh toán */}
      <Link to="/mykoi" className="back-button">
       back
      </Link>
    </div>
  );
}

export default KoiPayPage;
