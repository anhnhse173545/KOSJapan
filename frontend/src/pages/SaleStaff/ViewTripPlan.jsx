// ViewTripPlan.js
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, Typography, Divider, Spin, message } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const ViewTripPlan = () => {
  const location = useLocation();
  const { id } = useParams(); // Get the booking ID from URL params
  const [customerData, setCustomerData] = useState(null); // State for customer data
  const [itinerary, setItinerary] = useState([]); // State for itinerary data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    // Fetch trip plan data from the API
    axios
      .get(`http://localhost:8080/api/booking/get/${id}`)
      .then((response) => {
        setCustomerData(response.data); // Assume response contains customer data
        setItinerary(response.data.itinerary || []); // Set itinerary if available
        setLoading(false); // Turn off loading
      })
      .catch((err) => {
        console.error("Failed to fetch trip plan:", err);
        setError("Failed to fetch trip plan");
        setLoading(false); // Turn off loading
        message.error("Failed to load trip plan data.");
      });
  }, [id]); // Trigger useEffect when the component mounts or id changes

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  if (error) {
    return <Text type="danger">{error}</Text>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>
        Trip Plan for {customerData ? customerData.name : "Unknown Customer"}
      </Title>

      {customerData ? (
        <>
          <Card style={{ marginBottom: "20px" }}>
            <Title level={4}>Customer Information</Title>
            <Text strong>Name:</Text> {customerData.name}
            <br />
            <Text strong>Contact:</Text> {customerData.contact}
            <br />
            <Text strong>Koi Type:</Text> {customerData.koiType}
            <br />
            <Text strong>Koi Farm:</Text> {customerData.farm}
            <br />
            <Text strong>Start Date:</Text> {customerData.startDate}
            <br />
            <Text strong>End Date:</Text> {customerData.endDate}
            <br />
            <Text strong>Trip Details:</Text> {customerData.tripDetails}
            <br />
            <Text strong>Status:</Text> {customerData.status}
          </Card>

          <Divider />

          <Card>
            <Title level={4}>Itinerary</Title>
            {itinerary.length > 0 ? (
              itinerary.map((item, index) => <Text key={index}>{item}</Text>)
            ) : (
              <Text>No itinerary available.</Text>
            )}
          </Card>
        </>
      ) : (
        <Text>No customer data available.</Text>
      )}
    </div>
  );
};

export default ViewTripPlan;
