import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.scss';

const sampleItinerary = [
  {
    day: 'Day 1',
    farm: 'Farm A',
    koi: [
      {
        id: '1',
        name: 'Koi A1',
        img: 'https://i.etsystatic.com/16221531/r/il/283513/3896651157/il_570xN.3896651157_7xfk.jpg',
        weight: '3kg',
        size: '50cm',
        farm: 'Farm A',
      },
      {
        id: '2',
        name: 'Koi A2',
        img: 'https://i.etsystatic.com/16221531/r/il/283513/3896651157/il_570xN.3896651157_7xfk.jpg',
        weight: '2.5kg',
        size: '45cm',
        farm: 'Farm A',
      },
    ],
  },
  {
    day: 'Day 2',
    farm: 'Farm B',
    koi: [
      {
        id: '3',
        name: 'Koi B1',
        img: 'https://i.etsystatic.com/16221531/r/il/283513/3896651157/il_570xN.3896651157_7xfk.jpg',
        weight: '4kg',
        size: '55cm',
        farm: 'Farm B',
      },
      {
        id: '4',
        name: 'Koi B2',
        img: 'https://i.etsystatic.com/16221531/r/il/283513/3896651157/il_570xN.3896651157_7xfk.jpg',
        weight: '3.5kg',
        size: '52cm',
        farm: 'Farm B',
      },
    ],
  },
  {
    day: 'Day 3',
    farm: 'Farm C',
    koi: [],
  },
];


// Component to display the trip information
const SingleCustomerStaffData = ({ tripData }) => {
  return (
    <div className="customer-data">
      <h2>Trip Details</h2>
      <div className="customer-data-card">
        <h3>Name: {tripData.name}</h3>
        <p><strong>Email:</strong> {tripData.email}</p>
        <p><strong>Phone:</strong> {tripData.phone}</p>
        <p><strong>Koi Description:</strong> {tripData.koidescription}</p>
        <p><strong>Trip Description:</strong> {tripData.tripdescription}</p>
        <p><strong>Start Date:</strong> {tripData.startdate}</p>
        <p><strong>End Date:</strong> {tripData.enddate}</p>
      </div>
    </div>
  );
};

// Component to display sales staff information
const SingleSalesStaffData = ({ salesData }) => {
  return (
    <div className="sales-staff-data">
      <h2>Sales Staff Information</h2>
      <div className="staff-data-card">
        <h3>Trip: {salesData.tripDescription}</h3>
        <p><strong>Airport:</strong> {salesData.airport}</p>
        <p><strong>Sales Representative:</strong> {salesData.salesRep}</p>
        <p><strong>Benefits:</strong> {salesData.benefits}</p>
        <p><strong>Terms:</strong> {salesData.terms}</p>
        <p><strong>Additional Info:</strong> {salesData.additionalInfo}</p>
      </div>
    </div>
  );
};

// Itinerary Component to display koi details for each day
const Itinerary = ({ itinerary }) => {
  const navigate = useNavigate();
  const [expandedDays, setExpandedDays] = useState({});

  const toggleDetails = (dayIndex) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));
  };

  return (
    <div className="trip-details">
      {itinerary.map((dayDetail, index) => (
        <div key={index} className="day-detail">
          <h3>{dayDetail.day}</h3>
          <p><strong>Farm:</strong> {dayDetail.farm}</p>

          <button className="toggle-button" onClick={() => toggleDetails(index)}>
            {expandedDays[index] ? 'Hide Details' : 'View Details'}
          </button>

          {expandedDays[index] && (
            <div className="koi-details">
              {dayDetail.koi.length > 0 ? (
                dayDetail.koi.map((koiDetail, koiIndex) => (
                  <div key={koiIndex} className="koi-item">
                    <img
                      src={koiDetail.img}
                      alt={koiDetail.name}
                      className="koi-image-small"
                    />
                    <p><strong>ID:</strong> {koiDetail.id}</p>
                    <p><strong>Name:</strong> {koiDetail.name}</p>
                    <p><strong>Weight:</strong> {koiDetail.weight}</p>
                    <p><strong>Size:</strong> {koiDetail.size}</p>
                    <p><strong>Farm:</strong> {koiDetail.farm}</p>
                    <button className="view-koi-button" onClick={() => navigate(`/mykoi/${koiDetail.id}`)}>
                      View Koi Details
                    </button>
                  </div>
                ))
              ) : (
                <p>No koi details available for this day.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Main OnGoingPage Component
function OnGoingPage() {
  const { id } = useParams();  // Get ID from URL
  const navigate = useNavigate();

  // State for trip data
  const [tripData, setTripData] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [errorTrip, setErrorTrip] = useState(null);

  // State for sales data
  const [salesData, setSalesData] = useState(null);
  const [loadingSales, setLoadingSales] = useState(true);
  const [errorSales, setErrorSales] = useState(null);

  // Fetch trip data based on the ID from the URL
  useEffect(() => {
    fetch(`https://670857d88e86a8d9e42eb866.mockapi.io/api/v1/trip/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTripData(data);
        setLoadingTrip(false);

        // Fetch sales data if trip data is successfully retrieved
        if (id) {
          fetch(`https://6704ec62031fd46a830de9fb.mockapi.io/api/v1/sales/${id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((salesData) => {
              setSalesData(salesData);
              setLoadingSales(false);
            })
            .catch((error) => {
              setErrorSales(error);
              setLoadingSales(false);
            });
        } else {
          setLoadingSales(false); // Stop loading sales staff if no ID
        }
      })
      .catch((error) => {
        setErrorTrip(error);
        setLoadingTrip(false);
      });
  }, [id]);

  // Loading and error handling for both APIs
  if (loadingTrip || loadingSales) {
    return <div>Loading data...</div>;
  }

  if (errorTrip) {
    return <div>Error loading trip data: {errorTrip.message}</div>;
  }

  if (errorSales) {
    return <div>Error loading sales staff data: {errorSales.message}</div>;
  }

  return (
    <div className="quota-details-page">
      <h2>Trip Details for Quotation ID: {id}</h2>

      <div className="customer-sales-container">
        {/* Display Trip Information */}
        <div className="left-side">
          {tripData && <SingleCustomerStaffData tripData={tripData} />}
          {tripData.itinerary && <Itinerary itinerary={tripData.itinerary} />}
        </div>

        {/* Display Sales Staff Information */}
        <div className="right-side">
          {salesData ? (
            <SingleSalesStaffData salesData={salesData} />
          ) : (
            <div>No sales staff data available.</div>
          )}
        </div>

        <div className="App">
      <h1>Your Koi Trip Itinerary</h1>
      <Itinerary itinerary={sampleItinerary} />
    </div>
      </div>

      <div className="button-group">
        <div className="button-group">
          <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default OnGoingPage;
