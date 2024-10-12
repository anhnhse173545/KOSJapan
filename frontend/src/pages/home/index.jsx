import React from 'react';
import './index.scss';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <img
          src="https://cf.ltkcdn.net/feng-shui/images/orig/291786-1600x1066-symbolism-koi-fish-feng-shui.jpg"
          alt="Japanese Koi"
          className="hero-image"
        />
        <div className="hero-text">
          <h1>Koi Farm Trip: Txxxxxxxxxxx</h1>
          <p>Discover the most beautiful Koi varieties to enhance your home or garden.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
