"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Badge,
  Input,
  Form,
  Modal,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import "../../styles/Consulting/OrderList.css";

const OrderList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState([]);
  const [bookings, setBookings] = useState([]); // State to store booking data
  const [form] = Form.useForm();
  const [bookingId, setBookingId] = useState(""); // Selected booking ID
  const [farmId, setFarmId] = useState(""); // Selected farm ID
  const [deliveryAddress, setDeliveryAddress] = useState(""); // Delivery address
  const navigate = useNavigate();

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

  const fetchFarms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/farm/list");
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farm list:", error);
      message.error("Failed to load farm data.");
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/booking/consulting-staff/AC0004"
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching booking list:", error);
      message.error("Failed to load booking data.");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/fish-order/consulting-staff/AC0004"
        );
        console.log("Response data:", response.data); // Add this line to inspect the data
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("Failed to load order data.");
        setLoading(false);
      }
    };
    fetchOrders();
    fetchFarms();
    fetchBookings(); // Fetch bookings when component loads
  }, []);

  const calculateTotalPrice = (record) => {
    const fishTotal =
      record.fishOrderDetails?.reduce((total, item) => total + item.price, 0) ||
      0;
    const fishPackTotal =
      record.fishPackOrderDetails?.reduce(
        (total, item) => total + item.price,
        0
      ) || 0;
    return fishTotal + fishPackTotal;
  };

  const handleAddKoi = (orderId, farmId) => {
    navigate("add-koi", { state: { orderId, farmId } });
  };

  const handleDeleteOrder = async (record) => {
    try {
      const url = `http://localhost:8080/fish-order/${record.bookingId}/${record.farmId}/delete`;
      await axios.delete(url);
      message.success(`Order with ID ${record.id} has been deleted.`);
      fetchOrders();
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

  const handleDeleteFishOrderDetail = (orderId, fishOrderDetailId) => {
    if (!orderId) {
      message.error("Invalid order ID. Cannot delete fish order detail.");
      return;
    }
    Modal.confirm({
      title: "Are you sure you want to delete this fish order detail?",
      onOk: async () => {
        try {
          const url = `http://localhost:8080/fish-order/${orderId}/remove-fish-order-detail-from-order/${fishOrderDetailId}`;
          await axios.post(url);
          message.success("Fish order detail has been deleted.");
          fetchOrders();
        } catch (error) {
          console.error("Error deleting fish order detail:", error);
          message.error(
            error.response?.data?.message ||
              "Failed to delete fish order detail. Please check your network or server."
          );
        }
      },
    });
  };

  const handleDeleteFishPackOrderDetail = (orderId, fishPackOrderDetailId) => {
    if (!orderId) {
      message.error("Invalid order ID. Cannot delete fish pack order detail.");
      return;
    }
    Modal.confirm({
      title: "Are you sure you want to delete this fish pack order?",
      onOk: async () => {
        try {
          const url = `http://localhost:8080/fish-order/${orderId}/remove-pack-order-detail-from-order/${fishPackOrderDetailId}`;
          await axios.post(url);
          message.success("Fish pack order has been deleted.");
          fetchOrders();
        } catch (error) {
          console.error("Error deleting fish pack order:", error);
          message.error(
            error.response?.data?.message ||
              "Failed to delete fish pack order. Please check your network or server."
          );
        }
      },
    });
  };

  const handleCreateOrder = async () => {
    try {
      const payload = {
        deliveryAddress, // Include the delivery address in the payload
      };

      // API request to create the order
      const response = await axios.post(
        `http://localhost:8080/fish-order/${bookingId}/${farmId}/create`,
        payload
      );

      message.success(`Order created with ID: ${response.data.id}`);
      fetchOrders(); // Refresh orders list after successful creation
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

  const handleUpdatePaymentStatus = async (record) => {
    try {
      const url = `http://localhost:8080/fish-order/${record.bookingId}/${record.farmId}/update`;
      const payload = {
        paymentStatus: "Deposited",
      };
      await axios.put(url, payload);
      message.success(`Payment status updated for Order ID: ${record.id}`);
      fetchOrders();
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

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 100, // Narrower
    },
    {
      title: "Farm ID",
      dataIndex: "farmId",
      key: "farmId",
      sorter: (a, b) => a.farmId.localeCompare(b.farmId),
      width: 120, // Narrower
    },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      sorter: (a, b) => a.bookingId.localeCompare(b.bookingId),
      width: 120, // Narrower
    },
    {
      title: "Delivery Address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      render: (deliveryAddress) => deliveryAddress || "N/A",
      width: 275,
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
      width: 150, // Adjust as needed
    },
    {
      title: "Total Price",
      key: "total",
      render: (_, record) => <span>{calculateTotalPrice(record)}</span>,
      width: 150, // Adjust as needed
    },
    {
      title: "Action",
      key: "action",
      width: 180, // Narrow the Action column
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
      title: "Fish Order Detail ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Fish ID",
      dataIndex: ["fish", "fish_id"], // Corrected field for Fish ID
      key: "fishId",
    },
    {
      title: "Variety",
      dataIndex: ["fish", "fish_variety_name"], // Corrected field for Variety name
      key: "variety",
    },
    {
      title: "Length",
      dataIndex: ["fish", "length"],
      key: "length",
    },
    {
      title: "Weight",
      dataIndex: ["fish", "weight"],
      key: "weight",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
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
            handleDeleteFishOrderDetail(
              fishOrderDetail.orderId,
              fishOrderDetail.id
            )
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
          dataSource={record.fishOrderDetails.map((detail) => ({
            ...detail,
            orderId: record.id,
          }))}
          pagination={false}
          rowKey={(row) => row.id}
        />
        <h4>Fish Pack Order Details</h4>
        <Table
          columns={[
            {
              title: "Fish Pack Order ID",
              dataIndex: "id",
              key: "id",
            },
            {
              title: "Variety",
              dataIndex: ["fishPack", "variety", "name"],
              key: "variety",
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
            {
              title: "Quantity",
              dataIndex: ["fishPack", "quantity"],
              key: "quantity",
            },
            {
              title: "Description",
              dataIndex: ["fishPack", "description"],
              key: "description",
            },
            {
              title: "Price",
              dataIndex: "price",
              key: "price",
            },
            {
              title: "Action",
              key: "action",
              render: (_, fishPackOrderDetail) => (
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    handleDeleteFishPackOrderDetail(
                      record.id,
                      fishPackOrderDetail.id
                    )
                  }
                >
                  Delete
                </Button>
              ),
            },
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
      <h1 className="order-list-header">Fish Order List</h1>
      <div className="order-form-container">
        <Form form={form} layout="inline" className="order-form">
          {/* Booking ID Select */}
          <Form.Item label="Booking ID" className="order-form-item">
            <Select
              value={bookingId}
              onChange={(value) => setBookingId(value)}
              placeholder="Select Booking ID"
              style={{ width: 250 }}
            >
              {bookings.map((booking) => (
                <Select.Option key={booking.id} value={booking.id}>
                  {booking.id}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Farm ID Select */}
          <Form.Item label="Farm ID" className="order-form-item">
            <Select
              value={farmId}
              onChange={(value) => setFarmId(value)}
              placeholder="Select Farm"
              style={{ width: 250 }}
            >
              {farms.map((farm) => (
                <Select.Option key={farm.id} value={farm.id}>
                  {farm.name} ({farm.id})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Delivery Address Input */}
          <Form.Item label="Delivery Address" className="order-form-item">
            <Input
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter Delivery Address"
              style={{ width: 250 }}
            />
          </Form.Item>

          <Form.Item className="order-form-item">
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
