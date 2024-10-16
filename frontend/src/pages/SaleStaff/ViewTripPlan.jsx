import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Divider,
  Spin,
  message,
  Button,
  Select,
  Input,
  DatePicker,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;

const ViewTripPlan = () => {
  const { id } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingDestination, setCreatingDestination] = useState(false);
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [visitDate, setVisitDate] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Fetch trip data and farms
    axios
      .get(`http://localhost:8080/api/booking/BO0001/trip`)
      .then((response) => {
        setTripData(response.data);
        setPrice(response.data.price);
        setStatus(response.data.status);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch trip plan:", err);
        setError("Failed to fetch trip plan");
        setLoading(false);
        message.error("Failed to load trip plan data.");
      });

    axios
      .get(`http://localhost:8080/api/farm/list`)
      .then((response) => {
        setFarms(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch farms:", err);
        message.error("Failed to load farms.");
      });
  }, [id]);

  const handleCreateDestination = () => {
    if (!tripData || !selectedFarmId || !visitDate || !description) {
      message.error("All fields must be filled.");
      return;
    }

    setCreatingDestination(true);

    const payload = {
      farmId: selectedFarmId,
      visitDate: visitDate.toISOString(),
      description,
    };

    axios
      .post(
        `http://localhost:8080/api/trip-destination/${tripData.id}/create`,
        payload
      )
      .then((response) => {
        setTripData((prevData) => ({
          ...prevData,
          tripDestinations: [...prevData.tripDestinations, response.data],
        }));
        message.success("New trip destination created successfully!");
        setSelectedFarmId("");
        setVisitDate(null);
        setDescription("");
      })
      .catch((error) => {
        console.error("Failed to create trip destination:", error);
        message.error("Failed to create trip destination.");
      })
      .finally(() => {
        setCreatingDestination(false);
      });
  };

  // Function to handle updating trip information
  const handleUpdateTripInfo = () => {
    const payload = {
      price: price,
      status: status,
    };

    axios
      .post(`http://localhost:8080/api/booking/update/BO0001`, payload)
      .then(() => {
        setTripData((prevData) => ({
          ...prevData,
          price: price,
          status: status,
        }));
        message.success("Trip information updated successfully!");
      })
      .catch((error) => {
        console.error("Failed to update trip information:", error);
        message.error("Failed to update trip information.");
      });
  };

  // Function to handle deleting a trip destination
  const handleDeleteDestination = (tripDestinationId) => {
    axios
      .delete(
        `http://localhost:8080/api/trip-destination/${tripDestinationId}/delete`
      )
      .then(() => {
        // Remove deleted destination from tripData
        setTripData((prevData) => ({
          ...prevData,
          tripDestinations: prevData.tripDestinations.filter(
            (destination) => destination.id !== tripDestinationId
          ),
        }));
        message.success("Trip destination deleted successfully!");
      })
      .catch((error) => {
        console.error("Failed to delete trip destination:", error);
        message.error("Failed to delete trip destination.");
      });
  };

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
      <Title level={2}>Trip Plan Details</Title>

      {tripData ? (
        <>
          <Card style={{ marginBottom: "20px" }}>
            <Title level={4}>Trip Information</Title>
            <Text strong>Trip ID:</Text> {tripData.id}
            <br />
            <Text strong>Start Date:</Text>{" "}
            {moment(tripData.startDate).format("YYYY-MM-DD")}
            <br />
            <Text strong>End Date:</Text>{" "}
            {moment(tripData.endDate).format("YYYY-MM-DD")}
            <br />
            <Text strong>Departure Airport:</Text> {tripData.departureAirport}
            <br />
            <Input
              placeholder="Enter new price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: "200px", marginRight: "10px" }}
            />
            <Select
              placeholder="Select status"
              value={status}
              onChange={(value) => setStatus(value)}
              style={{ width: "200px", marginRight: "10px" }}
            >
              <Option value="Pending">Pending</Option>
              <Option value="Confirmed">Confirmed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
            <Button type="primary" onClick={handleUpdateTripInfo}>
              Update Trip Info
            </Button>
            <Divider />
          </Card>

          <Card>
            <Title level={4}>Trip Destinations</Title>
            {tripData.tripDestinations.length > 0 ? (
              tripData.tripDestinations.map((destination) => (
                <div key={destination.id}>
                  <Text strong>Farm Name:</Text> {destination.farm.name}
                  <br />
                  <Text strong>Farm Address:</Text> {destination.farm.address}
                  <br />
                  <Text strong>Farm Contact:</Text>{" "}
                  {destination.farm.phoneNumber}
                  <br />
                  <Text strong>Visit Date:</Text>{" "}
                  {destination.visitDate
                    ? moment(destination.visitDate).format("YYYY-MM-DD")
                    : "N/A"}
                  <br />
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleDeleteDestination(destination.id)}
                    style={{ marginTop: "10px" }}
                    icon={<DeleteOutlined />} // Trash can icon
                  >
                    Delete Destination
                  </Button>
                  <Divider />
                </div>
              ))
            ) : (
              <Text>No destinations available for this trip.</Text>
            )}

            <Divider />

            <Title level={4}>Add New Trip Destination</Title>
            <Select
              placeholder="Select a farm"
              value={selectedFarmId}
              onChange={(value) => setSelectedFarmId(value)}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              {farms.map((farm) => (
                <Option key={farm.id} value={farm.id}>
                  {farm.name}
                </Option>
              ))}
            </Select>

            <DatePicker
              placeholder="Select visit date"
              onChange={(date) => setVisitDate(date)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <Input
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ marginBottom: "10px" }}
            />

            <Button
              type="primary"
              onClick={handleCreateDestination}
              loading={creatingDestination}
              style={{ marginTop: "20px" }}
            >
              Create Trip Destination
            </Button>
          </Card>
        </>
      ) : (
        <Text>No trip data available.</Text>
      )}
    </div>
  );
};

export default ViewTripPlan;
