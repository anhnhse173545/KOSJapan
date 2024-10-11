import React from "react";
import { useParams } from "react-router-dom";
import { Card, Steps, Descriptions, Typography, Divider, Tag } from "antd";

const { Step } = Steps;
const { Title, Paragraph } = Typography;

const TrackingOrder = () => {
  const { orderId } = useParams();

  // This is mock data. In a real application, you would fetch this data based on the orderId
  const orderDetails = {
    id: orderId,
    customer: "Alice Smith",
    address: "123 Main St",
    status: "In Transit",
    product: "Koi Fish",
    variety: "Kohaku",
    size: "8-10 inches",

    totalPrice: 300.0,
    orderDate: "2023-06-15",
    estimatedDelivery: "2023-06-18",
    koiFarm: "Sunrise Koi Farm",
  };

  const getStatusStep = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "In Transit":
        return 1;
      case "Delivered":
      case "Rejected":
        return 2;
      case "Completed":
      case "Cancelled":
      case "Return":
        return 3;
      default:
        return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "gold";
      case "In Transit":
        return "blue";
      case "Delivered":
        return "green";
      case "Completed":
        return "green";
      case "Rejected":
        return "volcano";
      case "Cancelled":
        return "red";
      case "Return":
        return "purple";
      default:
        return "default";
    }
  };

  const orderStatus = getStatusStep(orderDetails.status);

  const koiCareInfo = [
    "Maintain water quality with proper filtration",
    "Feed a balanced diet of high-quality koi food",
    "Ensure the pond has adequate space (at least 1000 gallons for a few koi)",
    "Monitor water temperature and oxygen levels",
    "Perform regular health checks on your koi",
  ];

  return (
    <div>
      <Title level={2}>Order Tracking</Title>
      <Card
        title={`Order ID: ${orderId}`}
        style={{ width: "100%", marginBottom: "20px" }}
      >
        <Steps current={orderStatus}>
          <Step title="Pending" description="Order has been placed" />
          <Step title="In Transit" description="Order is on the way" />
          <Step
            title="Delivered/Rejected"
            description="Order delivered or rejected"
          />
          <Step
            title="Completed/Cancelled/Return"
            description="Order finalized"
          />
        </Steps>
        <Divider />
        <Descriptions title="Order Details" bordered>
          <Descriptions.Item label="Customer">
            {orderDetails.customer}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {orderDetails.address}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(orderDetails.status)}>
              {orderDetails.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Product">
            {orderDetails.product}
          </Descriptions.Item>
          <Descriptions.Item label="Variety">
            {orderDetails.variety}
          </Descriptions.Item>
          <Descriptions.Item label="Size">
            {orderDetails.size}
          </Descriptions.Item>

          <Descriptions.Item label="Koi Farm">
            {orderDetails.koiFarm}
          </Descriptions.Item>
          <Descriptions.Item label="Order Date">
            {orderDetails.orderDate}
          </Descriptions.Item>
          <Descriptions.Item label="Estimated Delivery">
            {orderDetails.estimatedDelivery}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Koi Care Recommendations" style={{ width: "100%" }}>
        <Paragraph>
          Congratulations on your new Koi fish from {orderDetails.koiFarm}! Here
          are some tips to ensure they thrive in their new home:
        </Paragraph>
        <ul>
          {koiCareInfo.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
        <Paragraph>
          Remember, Koi can live for several decades with proper care. Enjoy
          your beautiful new pets!
        </Paragraph>
      </Card>
    </div>
  );
};

export default TrackingOrder;
