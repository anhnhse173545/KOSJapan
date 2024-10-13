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
      customerId: customer.id,
      farm: values.farm,
      koiType: values.koiType,
      startDate: values.startDate.format("YYYY-MM-DD"),
      endDate: values.endDate.format("YYYY-MM-DD"),
      description: values.description,
    };

    // Send trip plan data to API
    axios
      .post("http://localhost:8080/api/trip-plans", tripPlan)
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
          name="koiType"
          label="Koi Type"
          rules={[{ required: true, message: "Please select a koi type!" }]}
        >
          <Select>
            <Option value="kohaku">Kohaku</Option>
            <Option value="sanke">Sanke</Option>
            <Option value="showa">Showa</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="farm"
          label="Koi Farm"
          rules={[{ required: true, message: "Please select a koi farm!" }]}
        >
          <Select>
            <Option value="farm1">Farm 1</Option>
            <Option value="farm2">Farm 2</Option>
            <Option value="farm3">Farm 3</Option>
          </Select>
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
          name="description"
          label="Trip Description"
          rules={[
            { required: true, message: "Please enter trip description!" },
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
