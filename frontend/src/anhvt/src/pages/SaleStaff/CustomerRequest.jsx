import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  DatePicker,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const CustomerRequest = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch customer requests from API
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/trip/create")
      .then((response) => {
        setCustomers(response.data); // Set the fetched data
      })
      .catch((error) => {
        console.error("Failed to load customer requests:", error);
        message.error("Failed to load customer requests");
      });
  }, []);

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      ...customer,
      startDate: moment(customer.startDate),
      endDate: moment(customer.endDate),
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === editingCustomer.id
              ? { ...customer, ...values }
              : customer
          )
        );
        setIsModalVisible(false);
        message.success("Customer details updated successfully!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCreateTripPlan = (customer) => {
    navigate("/create-trip-plan", { state: { customer } });
  };

  const handleViewTripPlan = (customer) => {
    navigate("/view-trip-plan", { state: { customer } });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: ["farms", "0", "farm", "name"], // Adjust to API data structure
      key: "name",
    },
    {
      title: "Contact",
      dataIndex: "contact", // Adjust this field according to the data structure
      key: "contact",
    },
    {
      title: "Koi Type",
      dataIndex: ["farms", "0", "farm", "varieties", "0", "name"], // Adjust to API data structure
      key: "koiType",
    },
    {
      title: "Koi Farm",
      dataIndex: ["farms", "0", "farm", "name"], // Adjust to API data structure
      key: "farm",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Trip Details",
      dataIndex: "description", // Adjust this based on API response
      key: "tripDetails",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        const status = record.status || "Requested"; // Add a status field as per the requirement
        return (
          <>
            {status === "Requested" ? (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(record)}
                  style={{ marginRight: 8 }}
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleCreateTripPlan(record)}
                  style={{ marginRight: 8 }}
                >
                  Create Trip Plan
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                onClick={() => handleViewTripPlan(record)}
                style={{ marginRight: 8 }}
              >
                View Trip Plan
              </Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <h2>Customer Requests</h2>
      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title="Edit Customer Request"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Customer Name"
            rules={[
              { required: true, message: "Please enter the customer's name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Contact Information"
            rules={[
              { required: true, message: "Please enter contact information!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="koiType"
            label="Koi Type"
            rules={[{ required: true, message: "Please select the Koi type!" }]}
          >
            <Select>{/* Add koi types here */}</Select>
          </Form.Item>
          <Form.Item
            name="farm"
            label="Koi Farm"
            rules={[{ required: true, message: "Please select a farm!" }]}
          >
            <Select>{/* Add farm names here */}</Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select a start date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select an end date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="tripDetails"
            label="Trip Details"
            rules={[{ required: true, message: "Please enter trip details!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CustomerRequest;
