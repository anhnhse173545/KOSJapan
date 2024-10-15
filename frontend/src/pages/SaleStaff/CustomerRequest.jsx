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
import { EditOutlined } from "@ant-design/icons";
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
      .get("http://localhost:8080/api/booking/sale-staff/AC0002") // Fetch from correct API
      .then((response) => {
        setCustomers(response.data); // Set the fetched data
      })
      .catch((error) => {
        console.error("Failed to load customer requests:", error);
        message.error("Failed to load customer requests");
      });
  }, []);

  // Handle save and update the customer data via API
  // Open modal to edit customer
  const openEditModal = (customer) => {
    setEditingCustomer(customer); // Store the original data
    form.setFieldsValue({
      name: customer.customer.name,
      email: customer.customer.email,
      startDate: moment(customer.trip.startDate),
      endDate: moment(customer.trip.endDate),
      tripDetails: customer.description, // Use customer.description here
    });
    setIsModalVisible(true);
  };

  // Handle save and update the customer data via API
  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const fieldsToUpdate = {};

        // Compare new values with original customer data
        if (values.name !== editingCustomer.customer.name) {
          fieldsToUpdate["customer.name"] = values.name;
        }
        if (values.email !== editingCustomer.customer.email) {
          fieldsToUpdate["customer.email"] = values.email;
        }
        if (values.tripDetails !== editingCustomer.description) {
          fieldsToUpdate["description"] = values.tripDetails;
        }
        if (
          values.startDate &&
          values.startDate.format("YYYY-MM-DD") !==
            moment(editingCustomer.trip.startDate).format("YYYY-MM-DD")
        ) {
          fieldsToUpdate["trip.startDate"] =
            values.startDate.format("YYYY-MM-DD");
        }
        if (
          values.endDate &&
          values.endDate.format("YYYY-MM-DD") !==
            moment(editingCustomer.trip.endDate).format("YYYY-MM-DD")
        ) {
          fieldsToUpdate["trip.endDate"] = values.endDate.format("YYYY-MM-DD");
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
          message.info("No changes detected.");
          return; // Do not proceed if no fields were changed
        }

        console.log("Fields to update:", fieldsToUpdate); // Log the fields to be updated

        // Send only the updated fields in the payload
        axios
          .put(
            `http://localhost:8080/api/trip/update/${editingCustomer.trip.id}`,
            fieldsToUpdate
          )
          .then((response) => {
            console.log("API response:", response.data); // Log the API response

            // Update local state with the modified data
            setCustomers((prevCustomers) =>
              prevCustomers.map((customer) =>
                customer.trip.id === editingCustomer.trip.id
                  ? {
                      ...customer,
                      customer: {
                        ...customer.customer,
                        ...(fieldsToUpdate["customer.name"]
                          ? { name: fieldsToUpdate["customer.name"] }
                          : {}),
                        ...(fieldsToUpdate["customer.email"]
                          ? { email: fieldsToUpdate["customer.email"] }
                          : {}),
                      },
                      description:
                        fieldsToUpdate["description"] || customer.description,
                      trip: {
                        ...customer.trip,
                        ...(fieldsToUpdate["trip.startDate"]
                          ? { startDate: fieldsToUpdate["trip.startDate"] }
                          : {}),
                        ...(fieldsToUpdate["trip.endDate"]
                          ? { endDate: fieldsToUpdate["trip.endDate"] }
                          : {}),
                      },
                    }
                  : customer
              )
            );

            setIsModalVisible(false);
            message.success("Customer details updated successfully!");
          })
          .catch((error) => {
            console.error("Failed to update customer details:", error);
            message.error("Failed to update customer details.");
          });
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
      title: "Customer Name",
      dataIndex: ["customer", "name"], // Adjusted for API structure
      key: "customerName",
    },
    {
      title: "Email",
      dataIndex: ["customer", "email"], // Email field
      key: "email",
    },
    {
      title: "Koi Farm",
      dataIndex: ["trip", "tripDestinations", "0", "farm", "name"], // Adjust to API data structure
      key: "farm",
    },
    {
      title: "Start Date",
      dataIndex: ["trip", "startDate"],
      key: "startDate",
      render: (date) => moment(date).format("YYYY-MM-DD"), // Format the date
    },
    {
      title: "End Date",
      dataIndex: ["trip", "endDate"],
      key: "endDate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Description",
      dataIndex: "description", // Changed to use the correct description field
      key: "description",
    },
    {
      title: "Status", // New Status column
      dataIndex: "status", // Status from API data
      key: "status",
      render: (status) => status || "Requested", // Default to 'Requested' if not provided
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        return (
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
            <Button
              type="primary"
              onClick={() => handleViewTripPlan(record)}
              style={{ marginRight: 8 }}
            >
              View Trip Plan
            </Button>
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
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the email!" }]}
          >
            <Input />
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
            label="Description"
            rules={[
              { required: true, message: "Please enter trip description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CustomerRequest;
