
const koiFishList = [
  { id: 1, name: "Kohaku", size: "16 inches", price: "$2000", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkLvVPJoVjbOGAYPWM3Vk41RMNOozqrAtQBQ&s" },
  { id: 2, name: "Sanke", size: "18 inches", price: "$3000", image: "https://i.pinimg.com/736x/2d/19/36/2d1936d03fc18565e256a926eac296a5.jpg" },
  { id: 3, name: "Showa", size: "20 inches", price: "$5000", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGxLu-PpnCIEsmOCl2pJ8CEyjuRQNkJKFLQg&s" },
];

function KoiList() {
  return (
    <div className="koi-list-container">
      <h2 className="koi-list-title">Explore Our Beautiful Koi Collection</h2>
      <ul className="koi-list">
        {koiFishList.map((koi) => (
          <li key={koi.id} className="koi-item">
            <img src={koi.image} alt={koi.name} className="koi-image" />
            <div className="koi-details">
              <span className="koi-name">{koi.name}</span>
              <span className="koi-size">Size: {koi.size}</span>
            </div>
            <span className="koi-price">{koi.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KoiList;
