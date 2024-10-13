import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Badge,
  Card,
  Tabs,
  Tab,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const TrackingOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8080/fish-order/all");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "in transit":
        return "info";
      case "delivered":
      case "completed":
        return "success";
      case "rejected":
      case "cancelled":
        return "danger";
      case "return":
        return "secondary";
      default:
        return "light";
    }
  };

  const formatOrderDetails = (fishOrderDetails) => {
    return fishOrderDetails
      .map(
        (detail) =>
          `${detail.fish.variety.name} (${detail.fish.length} cm, ${detail.fish.weight} kg)`
      )
      .join(", ");
  };

  const getStatusStep = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 0;
      case "in transit":
        return 1;
      case "delivered":
      case "rejected":
        return 2;

      default:
        return 0;
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setActiveTab("details");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Order Tracking</h1>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="order-tracking-tabs"
        className="mb-3"
      >
        <Tab eventKey="list" title="Order List">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Fish Varieties</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.bookingId}</td>
                  <td>{formatOrderDetails(order.fishOrderDetails)}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <Badge bg={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="details" title="Order Details">
          {selectedOrder ? (
            <Card>
              <Card.Header>
                <Card.Title>
                  Order Details: {selectedOrder.bookingId}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Delivery Address: {selectedOrder.deliveryAddress}
                </Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-4">
                  {["Pending", "In Transit", "Delivered"].map((step, index) => (
                    <div key={step} className="text-center">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center ${
                          index <= getStatusStep(selectedOrder.status)
                            ? "bg-primary text-white"
                            : "bg-light"
                        }`}
                        style={{ width: "40px", height: "40px" }}
                      >
                        {index + 1}
                      </div>
                      <div className="mt-2">{step}</div>
                    </div>
                  ))}
                </div>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  <h5>Order Items</h5>
                  {selectedOrder.fishOrderDetails.map((detail) => (
                    <div key={detail.id} className="mb-3">
                      <strong>{detail.fish.variety.name}</strong> ($
                      {detail.fish_price.toFixed(2)})
                      <br />
                      <small>
                        Length: {detail.fish.length} cm, Weight:{" "}
                        {detail.fish.weight} kg
                      </small>
                    </div>
                  ))}
                  {selectedOrder.fishPackOrderDetails.map((detail) => (
                    <div key={detail.id} className="mb-3">
                      <strong>Fish Pack</strong> (${detail.price.toFixed(2)})
                      <br />
                      <small>
                        {detail.fishPack.description} - Quantity:{" "}
                        {detail.fishPack.quantity}
                      </small>
                    </div>
                  ))}
                </div>
              </Card.Body>
              <Card.Footer>
                <strong>Total: ${selectedOrder.total.toFixed(2)}</strong>
              </Card.Footer>
            </Card>
          ) : (
            <div className="text-center py-4">
              Select an order to view details
            </div>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default TrackingOrder;
