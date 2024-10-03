import { Link, useParams } from 'react-router-dom';

// Dữ liệu giả lập
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
    img: 'https://hanoverkoifarms.com/wp-content/uploads/2017/01/great-kohaku-739x1024.jpg',
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
    img: 'https://hanoverkoifarms.com/wp-content/uploads/2017/01/great-kohaku-739x1024.jpg',
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
    img: 'https://hanoverkoifarms.com/wp-content/uploads/2017/01/great-kohaku-739x1024.jpg',
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
      <p><strong>ID:</strong> {koi.id}</p>
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
