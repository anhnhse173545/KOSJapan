import React, { useState, useEffect } from "react";
import { Table, Button, message, Badge, Input, Form } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
const OrderList = () => {
  const [data, setData] = useState([]); // Data fetched from API
  const [loading, setLoading] = useState(false); // Loading state
  const [form] = Form.useForm();
  const [bookingId, setBookingId] = useState("");
  const [farmId, setFarmId] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const navigate = useNavigate();

  // Fetch orders data from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/fish-order/consulting-staff/AC0004"
      );
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

  const handleAddKoi = (orderId, farmId) => {
    navigate("/add-koi", { state: { orderId, farmId } });
  };
  // Handle deleting an order
  const handleDeleteOrder = async (record) => {
    try {
      const url = `http://localhost:8080/fish-order/${record.bookingId}/${record.farmId}/delete`;
      await axios.delete(url);
      message.success(`Order with ID ${record.id} has been deleted.`);
      fetchOrders(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Fish order not found"
      ) {
        message.error("Failed to delete order: Fish order not found.");
      } else {
        message.error(
          "Failed to delete order. Please check your network and server."
        );
      }
    }
  };
  const handleDeleteFishOrderDetail = async (fishOrderDetailId, record) => {
    try {
      const url = `http://localhost:8080/fish-order/${record.id}/remove-fish-order-detail-from/${fishOrderDetailId}`;
      await axios.delete(url);
      message.success("Fish order detail has been deleted.");
      fetchOrders(); // Refresh the order list after deletion
    } catch (error) {
      console.error("Error deleting fish order detail:", error);
      message.error("Failed to delete fish order detail.");
    }
  };

  // Handle creating a new order
  const handleCreateOrder = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/fish-order/${bookingId}/${farmId}/create`
      );
      message.success(`Order created with ID: ${response.data.id}`);
      fetchOrders(); // Refresh the list after creating the order
    } catch (error) {
      console.error("Error creating order:", error);
      if (error.response) {
        message.error(
          `Failed to create order: ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else {
        message.error(
          "Failed to create order. Please check your network and server."
        );
      }
    }
  };

  // Function to update payment status
  const handleUpdatePaymentStatus = async (record) => {
    try {
      // Construct the API URL dynamically using bookingId and farmId
      const url = `http://localhost:8080/fish-order/${record.bookingId}/${record.farmId}/update`;

      // Send the PUT request to update payment status
      const payload = {
        paymentStatus: "Deposited", // Update to deposited
      };

      const response = await axios.put(url, payload);

      // Check the response to ensure the update was successful
      message.success(`Payment status updated for Order ID: ${record.id}`);
      fetchOrders(); // Refresh the order list after updating the payment status
    } catch (error) {
      console.error("Error updating payment status:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Fish order not found"
      ) {
        message.error("Failed to update payment status: Fish order not found.");
      } else if (error.response) {
        message.error(
          `Failed to update payment status: ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else {
        message.error(
          "Failed to update payment status. Please check your network and server."
        );
      }
    }
  };

  // Table columns with Update Payment Status action
  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Farm ID",
      dataIndex: "farmId",
      key: "farmId",
      sorter: (a, b) => a.farmId.localeCompare(b.farmId),
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      sorter: (a, b) => a.bookingId.localeCompare(b.bookingId),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus) => (
        <Badge
          status={paymentStatus === "Deposited" ? "success" : "warning"}
          text={paymentStatus || "Pending"}
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
        <>
          <Button
            type="primary"
            onClick={() => handleAddKoi(record.id, record.farmId)}
            style={{ marginRight: 8 }}
            disabled={record.paymentStatus === "Deposited"}
          >
            Add Koi
          </Button>
          <Button
            type="default"
            onClick={() => handleUpdatePaymentStatus(record)}
            disabled={record.paymentStatus === "Deposited"}
            style={{ marginRight: 8 }}
          >
            Update Payment Status
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteOrder(record)}
          />
        </>
      ),
    },
  ];
  const fishColumns = [
    {
      title: "Fish ID",
      dataIndex: ["fish", "id"],
      key: "fishId",
    },
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
    {
      title: "Action",
      key: "action",
      render: (_, fishOrderDetail) => (
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() =>
            handleDeleteFishOrderDetail(fishOrderDetail.id, record)
          }
        >
          Delete
        </Button>
      ),
    },
  ];

  const expandedRowRender = (record) => {
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
      <h1 style={{ textAlign: "center" }}>Fish Order List</h1>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Form form={form} layout="inline">
          <Form.Item label="Booking ID">
            <Input
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="Enter Booking ID"
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item label="Farm ID">
            <Input
              value={farmId}
              onChange={(e) => setFarmId(e.target.value)}
              placeholder="Enter Farm ID"
              style={{ width: 200 }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleCreateOrder}>
              Create Order
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: expandedRowRender,
        }}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ background: "#fff" }}
      />
    </div>
  );
};

export default OrderList;
