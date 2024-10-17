import React, { useState, useEffect } from "react";
import { Table, Button, message, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderList = () => {
  const [data, setData] = useState([]); // Data fetched from API
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Fetch orders data from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/fish-order/all");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to load order data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Load data when the component mounts
  }, []);

  // Calculate total price for each order
  const calculateTotalPrice = (record) => {
    const fishTotal =
      record.fishOrderDetails?.reduce(
        (total, item) => total + item.fish_price,
        0
      ) || 0;
    const fishPackTotal =
      record.fishPackOrderDetails?.reduce(
        (total, item) => total + item.price,
        0
      ) || 0;
    return fishTotal + fishPackTotal;
  };

  const handleAddKoi = (bookingId, farmId) => {
    navigate("/add-koi", { state: { bookingId, farmId } });
  };

  const columns = [
    { title: "Order ID", dataIndex: "id", key: "id" },
    { title: "Farm ID", dataIndex: "farmId", key: "farmId" },
    { title: "Booking ID", dataIndex: "bookingId", key: "bookingId" },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus) => (
        <Badge
          status={paymentStatus === "Paid" ? "success" : "warning"}
          text={paymentStatus || "Not Paid"}
        />
      ),
    },
    {
      title: "Total Price",
      key: "total",
      render: (_, record) => <span>{calculateTotalPrice(record)}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleAddKoi(record.id, record.farmId)}
        >
          Add Koi
        </Button>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const fishColumns = [
      {
        title: "Variety",
        dataIndex: ["fish", "variety", "name"],
        key: "variety",
      },
      { title: "Length", dataIndex: ["fish", "length"], key: "length" },
      { title: "Weight", dataIndex: ["fish", "weight"], key: "weight" },
      { title: "Price", dataIndex: "fish_price", key: "fish_price" },
      {
        title: "Description",
        dataIndex: ["fish", "description"],
        key: "description",
      },
    ];

    return (
      <div>
        <h4>Fish Order Details</h4>
        <Table
          columns={fishColumns}
          dataSource={record.fishOrderDetails}
          pagination={false}
          rowKey={(row) => row.id}
        />
        <h4>Fish Pack Order Details</h4>
        <Table
          columns={[
            {
              title: "Description",
              dataIndex: ["fishPack", "description"],
              key: "description",
            },
            {
              title: "Length",
              dataIndex: ["fishPack", "length"],
              key: "length",
            },
            {
              title: "Weight",
              dataIndex: ["fishPack", "weight"],
              key: "weight",
            },
            { title: "Price", dataIndex: "price", key: "price" },
          ]}
          dataSource={record.fishPackOrderDetails}
          pagination={false}
          rowKey={(row) => row.id}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fish Order List</h1>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: expandedRowRender,
        }}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default OrderList;
