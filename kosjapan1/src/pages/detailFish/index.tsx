import { Link, useParams } from 'react-router-dom';
import './index.scss'; // Assuming you're using a SCSS file for styling
const koiPayments = [
  {
    id: 1,
    name: 'Kohaku Koi Farm',
    koi: 'Showa - koi #S0508b066',
    size: 15,
    quantity: 1,
    status: 'Pending Payment',
    price: '$400.00',
    img: 'https://visinhcakoi.com/wp-content/uploads/2021/07/ca-koi-showa-2-600x874-1.jpg',
    gender: 'Male',
    height: '30 cm',
    weight: '1.5 kg',
    farm: 'Kohaku Koi Farm',
  },
  {
    id: 2,
    name: 'Kohaku Koi Farm',
    koi: 'Kohaku - koi #K0508b066',
    size: 18,
    quantity: 2,
    status: 'Transit',
    price: '$400.00',
    img: 'https://i.etsystatic.com/24648260/r/il/db0eac/2525964906/il_1080xN.2525964906_1k9t.jpg',
    gender: 'Female',
    height: '32 cm',
    weight: '1.7 kg',
    farm: 'Kohaku Koi Farm',
  },
  {
    id: 3,
    name: 'Kohaku Koi Farm',
    koi: 'Kohaku - koi #K0508b066',
    size: 18,
    quantity: 2,
    status: 'completed',
    price: '$400.00',
    img: 'https://cecilieo.com/content/images/wordpress/2020/11/23-koi-fish-watercolor-cecilieo.jpg',
    gender: 'Female',
    height: '12 cm',
    weight: '1.7 kg',
    farm: 'Kohaku Koi Farm',
  },
  {
    id: 4,
    name: 'Kohaku Koi Farm',
    koi: 'Kohaku - koi #K0508b066',
    size: 18,
    quantity: 5,
    status: 'Canceled',
    price: '$400.00',
    img: 'https://maxcare.edu.vn/wp-content/uploads/2024/09/anime-girl-119p0cpx.jpg',
    gender: 'Male',
    height: '13 cm',
    weight: '1.7 kg',
    farm: 'Kohaku Koi Farm',
  },
];

function KoiDetailPage() {
  const { id } = useParams(); // Lấy id từ URL
  const koi = koiPayments.find((k) => k.id === parseInt(id)); // Tìm con Koi theo id

  if (!koi) {
    return <div>Koi not found</div>;
  }

  return (
    <div className="koi-detail-page">
      <img src={koi.img} alt={koi.koi} className="koi-image" />
      <h1>{koi.koi}</h1>
      <p><strong>Name:</strong> {koi.name}</p>
      
      <p><strong>Size:</strong> {koi.size} cm</p>
      <p><strong>Quantity:</strong> {koi.quantity}</p>
      <p><strong>Height:</strong> {koi.height}</p>
      <p><strong>Weight:</strong> {koi.weight}</p>
      <p><strong>Gender:</strong> {koi.gender}</p>
      <p><strong>Farm:</strong> {koi.farm}</p>
      <p><strong>Status:</strong> {koi.status}</p>
      <p><strong>Price:</strong> {koi.price}</p>

      <Link to="/mykoi" className="back-button">
       back
      </Link>
    </div>
    
  );
}

export default KoiDetailPage;
