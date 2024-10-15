import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button, message, Spin } from "antd";

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
  const { bookingId } = useParams();
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/booking/get/${bookingId}`
        );
        console.log("API Response:", response.data);
        setTourData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tour data:", error);
        setError(
          error.message || "An error occurred while fetching tour data."
        );
        message.error("Failed to load tour details.");
        setLoading(false);
      }
    };

    fetchTourData();
  }, [bookingId]);

  const handleExportToPDF = () => {
    if (!tourData) {
      message.error("No tour data available to export.");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Tour Details", 20, 10);

      doc.autoTable({
        head: [["Customer", "Start Date", "End Date", "Status"]],
        body: [
          [
            tourData.customer?.name || "N/A",
            tourData.trip?.startDate?.split("T")[0] || "N/A",
            tourData.trip?.endDate?.split("T")[0] || "N/A",
            tourData.status || "N/A",
          ],
        ],
      });

      doc.text("Trip Destinations", 20, 50);
      const tripDestinations =
        tourData.trip?.tripDestinations?.map((dest) => [
          dest.farm?.name || "N/A",
          dest.farm?.address || "N/A",
          dest.farm?.phoneNumber || "N/A",
          dest.farm?.varieties?.map((variety) => variety.name).join(", ") ||
            "N/A",
        ]) || [];
      doc.autoTable({
        head: [["Farm Name", "Address", "Phone", "Varieties"]],
        body: tripDestinations,
      });

      doc.text("Fish Orders", 20, doc.lastAutoTable.finalY + 10);
      tourData.fishOrders?.forEach((order) => {
        doc.text(
          `Farm: ${order.farmId || "N/A"}`,
          20,
          doc.lastAutoTable.finalY + 20
        );
        doc.autoTable({
          head: [["Fish Variety", "Length (cm)", "Weight (kg)", "Description"]],
          body:
            order.fishOrderDetails?.map((detail) => [
              detail.fish?.variety?.name || "N/A",
              detail.fish?.length || "N/A",
              detail.fish?.weight || "N/A",
              detail.fish?.description || "N/A",
            ]) || [],
          startY: doc.lastAutoTable.finalY + 30,
        });
      });

      doc.text("Trip Plan", 20, doc.lastAutoTable.finalY + 30);
      doc.autoTable({
        body: tripPlanTemplate.split("\n").map((line) => [line.trim()]),
      });

      doc.save(`${tourData.customer?.name || "Tour"}_details.pdf`);
      message.success("PDF exported successfully.");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      message.error("Failed to export PDF.");
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!tourData) {
    return <div>No tour details available.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tour Details</h1>
      <p>
        <strong>Customer:</strong> {tourData.customer?.name || "N/A"}
      </p>
      <p>
        <strong>Start Date:</strong>{" "}
        {tourData.trip?.startDate?.split("T")[0] || "N/A"}
      </p>
      <p>
        <strong>End Date:</strong>{" "}
        {tourData.trip?.endDate?.split("T")[0] || "N/A"}
      </p>
      <p>
        <strong>Status:</strong> {tourData.status || "N/A"}
      </p>

      <h2>Trip Destinations</h2>
      {tourData.trip?.tripDestinations?.map((dest, index) => (
        <div key={index}>
          <h3>Farm: {dest.farm?.name || "N/A"}</h3>
          <p>Address: {dest.farm?.address || "N/A"}</p>
          <p>Phone: {dest.farm?.phoneNumber || "N/A"}</p>
          <p>
            Varieties:{" "}
            {dest.farm?.varieties?.map((v) => v.name).join(", ") || "N/A"}
          </p>
        </div>
      ))}

      <h2>Fish Orders</h2>
      {tourData.fishOrders?.map((order, index) => (
        <div key={index}>
          <h3>Farm ID: {order.farmId || "N/A"}</h3>
          <ul>
            {order.fishOrderDetails?.map((detail, detailIndex) => (
              <li key={detailIndex}>
                {detail.fish?.variety?.name || "N/A"} - Length:{" "}
                {detail.fish?.length || "N/A"}cm, Weight:{" "}
                {detail.fish?.weight || "N/A"}kg, Description:{" "}
                {detail.fish?.description || "N/A"}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h3>Trip Plan</h3>
      <pre>{tripPlanTemplate}</pre>

      <Button type="primary" onClick={handleExportToPDF}>
        Export to PDF
      </Button>
    </div>
  );
};

export default TourDetails;
