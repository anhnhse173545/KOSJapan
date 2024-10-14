// CreateTripPlan.js
import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const CreateTripPlan = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { customer } = location.state; // Receive customer data from state

  const handleSubmit = (values) => {
    const tripPlan = {
      id: values.id || "", // Auto-generate or handle ID elsewhere
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      departureAirport: values.departureAirport,
      description: values.description,
      price: values.price,
      status: values.status,
      tripDestinations: [
        {
          id: values.destinationId || "", // Can be auto-generated
          farm: {
            id: values.farm,
            address: values.farmAddress,
            phoneNumber: values.farmPhoneNumber,
            name: values.farmName,
            image: values.farmImage,
            varieties: [
              {
                id: values.varietyId,
                name: values.varietyName,
                description: values.varietyDescription,
              },
            ],
          },
          visitDate: values.visitDate.toISOString(),
          description: values.destinationDescription,
        },
      ],
    };

    // Send trip plan data to API
    axios
      .post("http://localhost:8080/api/trip/create", tripPlan)
      .then(() => {
        message.success("Trip plan created successfully!");
        navigate("/"); // Redirect back to customer list after creating the trip plan
      })
      .catch((error) => {
        console.error("Failed to create trip plan:", error);
        message.error("Failed to create trip plan.");
      });
  };

  return (
    <div>
      <h2>Create Trip Plan for {customer.customer.name}</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="id"
          label="Trip ID"
          rules={[{ required: true, message: "Please enter a trip ID!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="departureAirport"
          label="Departure Airport"
          rules={[
            { required: true, message: "Please enter the departure airport!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: "Please select a start date!" }]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: "Please select an end date!" }]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please enter trip status!" }]}
        >
          <Select>
            <Option value="planned">Planned</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter the price!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <h3>Trip Destination Details</h3>

        <Form.Item
          name="farm"
          label="Farm"
          rules={[{ required: true, message: "Please select a farm!" }]}
        >
          <Select>
            <Option value="farm1">Farm 1</Option>
            <Option value="farm2">Farm 2</Option>
            <Option value="farm3">Farm 3</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="visitDate"
          label="Visit Date"
          rules={[{ required: true, message: "Please select a visit date!" }]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          name="destinationDescription"
          label="Destination Description"
          rules={[
            {
              required: true,
              message: "Please enter destination description!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Trip Plan
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTripPlan;
