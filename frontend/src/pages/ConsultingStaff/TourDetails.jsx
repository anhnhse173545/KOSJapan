import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Button,
  message,
  Spin,
  Typography,
  Descriptions,
  Card,
  List,
  Collapse,
} from "antd";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const TourDetails = () => {
  const { bookingId } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        setError("No Booking ID provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/booking/get/${bookingId}`
        );
        setBookingData(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred."
        );
        message.error("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  const handleExportToPDF = () => {
    if (!bookingData) {
      message.error("No booking data available to export.");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Booking Details", 20, 10);

      // Booking Information
      doc.autoTable({
        head: [["Booking ID", "Customer", "Status", "Created At"]],
        body: [
          [
            bookingData.id,
            bookingData.customer.name,
            bookingData.status,
            new Date(bookingData.createAt).toLocaleString(),
          ],
        ],
        startY: 20,
      });

      // Trip Information
      doc.text("Trip Information", 20, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        head: [["Trip ID", "Start Date", "End Date", "Status", "Price"]],
        body: [
          [
            bookingData.trip.id,
            new Date(bookingData.trip.startDate).toLocaleString(),
            new Date(bookingData.trip.endDate).toLocaleString(),
            bookingData.trip.status,
            `$${bookingData.trip.price}`,
          ],
        ],
        startY: doc.lastAutoTable.finalY + 15,
      });

      // Trip Destinations
      doc.text("Trip Destinations", 20, doc.lastAutoTable.finalY + 10);
      const destinations = bookingData.trip.tripDestinations.map((dest) => [
        dest.farm.name,
        dest.farm.address,
        dest.farm.phoneNumber,
        dest.farm.varieties.map((v) => v.name).join(", "),
      ]);
      doc.autoTable({
        head: [["Farm Name", "Address", "Phone", "Varieties"]],
        body: destinations,
        startY: doc.lastAutoTable.finalY + 15,
      });

      // Fish Orders

      doc.save(`Booking_${bookingData.id}_details.pdf`);
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
    return <Text type="danger">Error: {error}</Text>;
  }

  if (!bookingData) {
    return <Text>No booking details available.</Text>;
  }

  return (
    <div className="p-6">
      <Title level={2}>Booking Details</Title>
      <Card className="mb-6">
        <Descriptions title="General Information" bordered>
          <Descriptions.Item label="Booking ID">
            {bookingData.id}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Name">
            {bookingData.customer?.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Email">
            {bookingData.customer?.email || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {bookingData.status}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(bookingData.createAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {bookingData.description || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Trip Information" className="mb-6">
        <Descriptions bordered>
          <Descriptions.Item label="Trip ID">
            {bookingData.trip.id}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {new Date(bookingData.trip.startDate).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {new Date(bookingData.trip.endDate).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Departure Airport">
            {bookingData.trip.departureAirport}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            ${bookingData.trip.price}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {bookingData.trip.status}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Trip Destinations" className="mb-6">
        <List
          dataSource={bookingData.trip.tripDestinations}
          renderItem={(dest) => (
            <List.Item>
              <List.Item.Meta
                title={dest.farm.name}
                description={
                  <>
                    <Text>Address: {dest.farm.address}</Text>
                    <br />
                    <Text>Phone: {dest.farm.phoneNumber}</Text>
                    <br />
                    <Text>
                      Varieties:{" "}
                      {dest.farm.varieties.map((v) => v.name).join(", ")}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Payment Information" className="mb-6">
        <Descriptions bordered>
          <Descriptions.Item label="Payment ID">
            {bookingData.tripPayment.id}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Method">
            {bookingData.tripPayment.paymentMethodName}
          </Descriptions.Item>
          <Descriptions.Item label="Amount">
            ${bookingData.tripPayment.amount}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Button type="primary" onClick={handleExportToPDF}>
        Export to PDF
      </Button>
    </div>
  );
};

export default TourDetails;
