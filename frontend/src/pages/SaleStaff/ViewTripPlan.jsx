import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Divider, Spin, message } from "antd";
import axios from "axios";
import moment from "moment";

const { Title, Text } = Typography;

const ViewTripPlan = () => {
  const { id } = useParams(); // Get the booking ID from URL params
  const [customerData, setCustomerData] = useState(null); // State for customer data
  const [tripPlan, setTripPlan] = useState([]); // State for trip plan data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    // Fetch customer booking and trip plan from the API
    axios
      .get(`http://localhost:8080/api/booking/sale-staff-customer/${id}`)
      .then((response) => {
        const bookingData = response.data[0]; // Assuming the first item is the relevant booking
        setCustomerData(bookingData); // Set customer booking data
        if (bookingData.trip) {
          setTripPlan(bookingData.trip); // Set trip plan if available
        }
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
        Trip Plan for{" "}
        {customerData ? customerData.customer.name : "Unknown Customer"}
      </Title>

      {customerData ? (
        <>
          <Card style={{ marginBottom: "20px" }}>
            <Title level={4}>Customer Information</Title>
            <Text strong>Name:</Text> {customerData.customer.name}
            <br />
            <Text strong>Email:</Text> {customerData.customer.email}
            <br />
            <Text strong>Phone:</Text> {customerData.customer.phone || "N/A"}
            <br />
            <Text strong>Description:</Text> {customerData.description}
            <br />
            <Text strong>Status:</Text> {customerData.status || "Requested"}
            <br />
            <Text strong>Booking Date:</Text>{" "}
            {moment(customerData.createAt).format("YYYY-MM-DD HH:mm")}
          </Card>

          <Divider />

          {tripPlan ? (
            <Card>
              <Title level={4}>Trip Plan</Title>
              <Text strong>Farm Name:</Text> {tripPlan.farm.name}
              <br />
              <Text strong>Farm Address:</Text> {tripPlan.farm.address}
              <br />
              <Text strong>Farm Contact:</Text> {tripPlan.farm.phoneNumber}
              <br />
              <Text strong>Visit Date:</Text>{" "}
              {moment(tripPlan.visitDate).format("YYYY-MM-DD HH:mm")}
              <br />
              <Text strong>Trip Description:</Text>{" "}
              {tripPlan.description || "N/A"}
              <br />
              <Title level={5} style={{ marginTop: "20px" }}>
                Fish Varieties at the Farm:
              </Title>
              {tripPlan.farm.varieties.length > 0 ? (
                tripPlan.farm.varieties.map((variety, index) => (
                  <div key={index}>
                    <Text strong>Variety Name:</Text> {variety.name}
                    <br />
                    <Text>Description:</Text> {variety.description}
                    <Divider />
                  </div>
                ))
              ) : (
                <Text>No varieties available.</Text>
              )}
            </Card>
          ) : (
            <Text>No trip plan available for this customer.</Text>
          )}
        </>
      ) : (
        <Text>No customer data available.</Text>
      )}
    </div>
  );
};

export default ViewTripPlan;
