import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button, message } from "antd";

// Sample trip plan template
const tripPlanTemplate = `
Day 1: Tokyo – A Blend of Old and New
  Morning: Tsukiji Market and Toyosu Market
  Midday: Tokyo Tower and Modern Art
  Afternoon: Shibuya Crossing and Shopping
  Evening: Dining in Golden Gai

Day 2: Kyoto – Timeless Traditions
  Morning: Fushimi Inari Shrine
  Midday: Nishiki Market and Lunch
  Afternoon: Traditional Arts and Green Tea Ceremony
  Evening: Traditional Japanese Dinner and Ryokan Experience

Day 3: The Mount Fuji Experience
  Early Morning: Travel to Mount Fuji
  Midday: Boat Ride and Lunch
  Afternoon: Hiking and Nature Exploration
  Evening: Luxury Onsen Ryokan Stay

Day 4: Tokyo Revisited – Cherry Blossoms and Serenity
  Morning: Meguro River Cherry Blossoms
  Midday: Lunch and Quirky Convenience Store Experience
  Afternoon: Cultural Sites and Relaxation
  Evening: Shibuya Sensory Overload

Day 5: Departure from Narita Airport
  Morning: Last Minute Shopping and Sightseeing
  Midday: Reflective Lunch
  Afternoon: Departure Preparations
`;

const TourDetails = () => {
  const { bookingId } = useParams(); // Get bookingId from URL params
  const [tourData, setTourData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch tour details from API using bookingId
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/booking/${bookingId}/trip`)
      .then((response) => {
        setTourData(response.data); // Set tour data from API response
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tour data:", error);
        message.error("Failed to load tour details.");
        setLoading(false);
      });
  }, [bookingId]);

  const handleExportToPDF = () => {
    if (!tourData) return;

    const doc = new jsPDF();
    doc.text("Tour Details", 20, 10);

    doc.autoTable({
      head: [["Customer", "Start Date", "End Date", "Status"]],
      body: [
        [
          tourData.booking.customer.name, // Customer name from API
          tourData.startDate.split("T")[0], // Format start date
          tourData.endDate.split("T")[0], // Format end date
          tourData.status, // Status from API
        ],
      ],
    });

    doc.text("Trip Plan", 20, 50);
    doc.autoTable({
      body: tripPlanTemplate.split("\n").map((line) => [line.trim()]), // Split and format trip plan
    });

    doc.save(`${tourData.booking.customer.name}_tour_details.pdf`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tourData) {
    return <div>No tour details available.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tour Details</h1>
      <p>
        <strong>Customer:</strong> {tourData.booking.customer.name}
      </p>
      <p>
        <strong>Start Date:</strong> {tourData.startDate.split("T")[0]}
      </p>
      <p>
        <strong>End Date:</strong> {tourData.endDate.split("T")[0]}
      </p>
      <p>
        <strong>Status:</strong> {tourData.status}
      </p>
      <h3>Trip Plan</h3>
      <pre>{tripPlanTemplate}</pre> {/* Displaying the trip plan */}
      <Button type="primary" onClick={handleExportToPDF}>
        Export to PDF
      </Button>
    </div>
  );
};

export default TourDetails;
