import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  message,
  Card,
  Descriptions,
  Steps,
  Tabs,
  Typography,
} from "antd";
import axios from "axios";

const { Step } = Steps;
const { TabPane } = Tabs;
const { Title } = Typography;

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("1");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/fish-order/all");
      setOrders(response.data);
    } catch (error) {
      message.error("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const formatOrderDetails = (fishOrderDetails) => {
    return fishOrderDetails
      .map(
        (detail) =>
          `${detail.fish.variety.name} (${detail.fish.length} cm, ${detail.fish.weight} kg)`
      )
      .join(", ");
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

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Delivery Address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
    },
    {
      title: "Fish Varieties",
      key: "fishVarieties",
      render: (_, record) => formatOrderDetails(record.fishOrderDetails),
    },
    {
      title: "Total Price",
      dataIndex: "total",
      key: "total",
      render: (total) => `$${total.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleViewDetails(record)}>View Details</Button>
      ),
    },
  ];

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setActiveTab("2");
  };

  return (
    <div>
      <Title level={2}>Order Tracking</Title>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Order List" key="1">
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="id"
            loading={loading}
          />
        </TabPane>
        <TabPane tab="Order Details" key="2">
          {selectedOrder ? (
            <Card title={`Order Details: ${selectedOrder.bookingId}`}>
              <Steps current={getStatusStep(selectedOrder.status)}>
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
              <Descriptions
                title="Order Information"
                bordered
                style={{ marginTop: 20 }}
              >
                <Descriptions.Item label="Delivery Address">
                  {selectedOrder.deliveryAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Total Price">
                  ${selectedOrder.total.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Fish Order Details" span={3}>
                  {selectedOrder.fishOrderDetails.map((detail) => (
                    <div key={detail.id}>
                      {detail.fish.variety.name} (Length: {detail.fish.length}{" "}
                      cm, Weight: {detail.fish.weight} kg, Price: $
                      {detail.fish_price})
                    </div>
                  ))}
                </Descriptions.Item>
                {selectedOrder.fishPackOrderDetails &&
                  selectedOrder.fishPackOrderDetails.length > 0 && (
                    <Descriptions.Item label="Fish Pack Order Details" span={3}>
                      {selectedOrder.fishPackOrderDetails.map((detail) => (
                        <div key={detail.id}>
                          Fish Pack (Price: ${detail.price}, Quantity:{" "}
                          {detail.fishPack.quantity})
                          <br />
                          Description: {detail.fishPack.description}
                        </div>
                      ))}
                    </Descriptions.Item>
                  )}
              </Descriptions>
            </Card>
          ) : (
            <div>Select an order to view details</div>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OrderTracking;
