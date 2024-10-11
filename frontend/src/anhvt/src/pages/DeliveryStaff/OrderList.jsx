import React from "react";
import { Table, Button, Tag } from "antd";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const navigate = useNavigate();

  const orders = [
    {
      id: 1,
      customer: "Alice Smith",
      address: "123 Main St",
      status: "In Transit",
      product: "Koi Fish",
      variety: "Kohaku",

      totalPrice: 300.0,
      koiFarm: "Sunrise Koi Farm",
    },
    {
      id: 2,
      customer: "Bob Johnson",
      address: "456 Elm St",
      status: "Pending",
      product: "Koi Fish",
      variety: "Showa",

      totalPrice: 200.0,
      koiFarm: "Golden Scales Koi",
    },
    {
      id: 3,
      customer: "Charlie Brown",
      address: "789 Oak St",
      status: "Delivered",
      product: "Koi Fish",
      variety: "Sanke",

      totalPrice: 450.0,
      koiFarm: "Mystic Waters Koi",
    },
    {
      id: 4,
      customer: "Diana Prince",
      address: "101 Pine St",
      status: "Rejected",
      product: "Koi Fish",
      variety: "Asagi",

      totalPrice: 350.0,
      koiFarm: "Azure Ponds Koi",
    },
    {
      id: 5,
      customer: "Ethan Hunt",
      address: "202 Maple St",
      status: "Cancelled",
      product: "Koi Fish",
      variety: "Kigoi",

      totalPrice: 150.0,
      koiFarm: "Serene Koi Gardens",
    },
  ];

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

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Variety",
      dataIndex: "variety",
      key: "variety",
    },

    {
      title: "Koi Farm",
      dataIndex: "koiFarm",
      key: "koiFarm",
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
        <Button onClick={() => navigate(`/TrackingOrder/${record.id}`)}>
          Track Order
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Order List</h2>
      <Table dataSource={orders} columns={columns} rowKey="id" />
    </div>
  );
};

export default OrderList;
