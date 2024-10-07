import React from 'react';
import './index.scss';

const HomePage: React.FC = () => {
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
          <h1>Japanese Koi: The Essence of Serenity for Your Space</h1>
          <p>Discover the most beautiful Koi varieties to enhance your home or garden.</p>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2>Tokyo Trip (Best seller)</h2>
        <div className="map-container">
          <img src="https://example.com/japan-map.jpg" alt="Map of Japan" className="map-image" />
          <div className="map-info">
            <h3>Explore Tokyo</h3>
            <p>Join our most popular trip to experience the beauty of Koi fish in Tokyo.</p>
            <button>Explore Now</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-item">
          <img src="https://example.com/icon-1.png" alt="Find your Koi" />
          <p>Find your perfect Koi</p>
        </div>
        <div className="feature-item">
          <img src="https://example.com/icon-2.png" alt="Best experience" />
          <p>Best experience</p>
        </div>
        <div className="feature-item">
          <img src="https://example.com/icon-3.png" alt="Care support" />
          <p>Top-notch care support</p>
        </div>
      </section>

      {/* Koi Types Section */}
      <section className="koi-types">
        <h2>Our Koi Varieties</h2>
        <div className="koi-list">
          <div className="koi-item">
            <img src="https://example.com/kohaku.jpg" alt="Kohaku" />
            <h3>Kohaku</h3>
            <button>Shop Now</button>
          </div>
          <div className="koi-item">
            <img src="https://example.com/showa.jpg" alt="Showa Sanshoku" />
            <h3>Showa Sanshoku</h3>
            <button>Shop Now</button>
          </div>
          <div className="koi-item">
            <img src="https://example.com/tancho.jpg" alt="Tancho" />
            <h3>Tancho</h3>
            <button>Shop Now</button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="introduction">
        <h2>Which fish best suits you?</h2>
        <p>Learn more about the different Koi varieties and how to choose the perfect one for your space.</p>
        <div className="intro-images">
          <img src="https://example.com/koi-1.jpg" alt="Koi 1" />
          <img src="https://example.com/koi-2.jpg" alt="Koi 2" />
          <img src="https://example.com/koi-3.jpg" alt="Koi 3" />
        </div>
      </section>
    </div>
  );
}

export default HomePage;
