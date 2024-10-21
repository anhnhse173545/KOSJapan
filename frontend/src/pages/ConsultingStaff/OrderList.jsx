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

const OrderList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState([]);
  const [form] = Form.useForm();
  const [bookingId, setBookingId] = useState("");
  const [farmId, setFarmId] = useState("");
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

  useEffect(() => {
    fetchOrders();
    fetchFarms();
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
    navigate("/add-koi", { state: { orderId, farmId } });
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
      const response = await axios.post(
        `http://localhost:8080/fish-order/${bookingId}/${farmId}/create`
      );
      message.success(`Order created with ID: ${response.data.id}`);
      fetchOrders();
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
          ></Button>
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
      dataIndex: ["fish", "id"],
      key: "fishId",
    },
    {
      title: "Variety",
      dataIndex: ["fish", "variety", "name"],
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
            <Select
              value={farmId}
              onChange={(value) => setFarmId(value)}
              placeholder="Select Farm"
              style={{ width: 200 }}
            >
              {farms.map((farm) => (
                <Select.Option key={farm.id} value={farm.id}>
                  {farm.name} ({farm.id})
                </Select.Option>
              ))}
            </Select>
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
