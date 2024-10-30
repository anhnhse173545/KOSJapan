import React from 'react'

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1>Koifish International: Your Trusted Partner in Koi and Aquatic Supplies</h1>

      <section className="about-us-section">
        <h2>About Us</h2>
        <p>
          Koifish International is a part of a global aquatic group specializing in the import, export, 
          farming, and distribution of Koi, tropical fish, pond fish, aquarium plants, and aquatic 
          accessories. We serve wholesalers and retailers throughout Europe and across the globe, 
          providing the highest quality products and services for fish enthusiasts everywhere.
        </p>
      </section>

      <section className="about-us-section">
        <h2>Our Story</h2>
        <p>
          Founded in 1997 in the heart of Japan's Koi industry, Koifish International was born out of a 
          desire to raise the standards of Koi supply. Unsatisfied with the quality and logistics of 
          available Koi, we established our own operations to improve the overall process. Today, we 
          continue to set the industry standard for quality, quarantine procedures, and export logistics.
        </p>
      </section>

      <section className="about-us-section">
        <h2>Commitment to Quality</h2>
        <p>
          We take pride in our permanent base in Ojiya, Japan, the epicenter of the Japanese Koi 
          industry. Our dedicated team works directly with Koi breeders to ensure that we provide the 
          healthiest, most vibrant Koi available. Our rigorous health protocols and expert logistics 
          are now widely adopted by others in the industry, but as pioneers, we remain at the forefront 
          of Koi export management.
        </p>
      </section>

      <section className="about-us-section">
        <h2>Global Reach</h2>
        <p>
          While our roots are in Japan, our reach extends worldwide. With strong support teams in 
          Europe, including Holland, France, Germany, and the UK, as well as agents in various 
          international locations, we ensure that our customers receive unparalleled service, timely 
          shipments, and ongoing support. Whether you are in Europe or elsewhere, our mission is to 
          deliver not just beautiful fish, but healthy and well-maintained Koi for long-term success 
          in the trade.
        </p>
      </section>

      <section className="about-us-section">
        <h2>Trusted Partners for the Long Term</h2>
        <p>
          Koifish International has always operated with a long-term vision. We are committed to 
          fostering success for both our customers and the broader fish-keeping hobby. By consistently 
          providing top-quality Koi and accessories, we help hobbyists enjoy a fulfilling and 
          sustainable experience, which, in turn, guarantees the success of our partners.
        </p>
      </section>

      <section className="about-us-section">
        <h2>Trade-Only Focus</h2>
        <p>
          Koifish International serves exclusively the professional trade market. We work with properly 
          registered wholesalers and retailers, ensuring that the Koi we supply are always in the best 
          condition. For private Koi enthusiasts, we recommend contacting our trusted dealers worldwide 
          who can provide detailed information and access to our Koi.
        </p>
      </section>

      <section className="about-us-section">
        <h2>Get in Touch</h2>
        <p>
          Interested in learning more? Reach out to us by phone or email. We are always happy to assist 
          you in finding the perfect Koi for your business. Or, for a truly immersive experience, visit 
          our facilities in Japan and see our operation firsthand.
        </p>
        <p>
          At Koifish International, we're passionate about supporting the world of Koi keeping – join 
          us on this journey!
        </p>
      </section>

      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_sJtZ9r_VRYrLeAxARsC5icePZPNBZnv-4w&s" 
        alt="Colorful Koi fish swimming in dark water" 
        className="about-us-image" 
      />

      <style jsx>{`
        .about-us-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          background-color: #f9f9f9;
          line-height: 1.6;
        }

        h1 {
          font-size: 2.5em;
          color: #2c3e50;
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }

        .about-us-section {
          background-color: #ffffff;
          padding: 30px;
          margin-bottom: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .about-us-section:hover {
          transform: translateY(-5px);
        }

        h2 {
          font-size: 1.8em;
          color: #2980b9;
          margin-bottom: 20px;
        }

        p {
          margin-bottom: 15px;
          font-size: 1.1em;
        }

        .about-us-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin-top: 30px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 600px) {
          .about-us-container {
            padding: 20px 10px;
          }

          h1 {
            font-size: 2em;
          }

          h2 {
            font-size: 1.5em;
          }

          .about-us-section {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default AboutUs