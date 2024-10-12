import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, message, InputNumber } from "antd";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const CreateTripPlan = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;

  // Log customer data for debugging
  console.log("Customer data from location.state:", customer);

  // Pre-fill form if customer trip data is available
  useEffect(() => {
    if (customer) {
      const tripPlan = customer.tripPlan || {}; // Default empty object
      form.setFieldsValue({
        ...tripPlan,
        startDate: tripPlan.startDate ? moment(tripPlan.startDate) : null,
        endDate: tripPlan.endDate ? moment(tripPlan.endDate) : null,
        price: tripPlan.price || 0,
      });
    } else {
      console.error("Customer data is missing!");
      message.error(
        "Unable to load trip data. Customer information is missing."
      );
    }
  }, [customer, form]);

  // Custom validation: start date should not be greater than end date
  const validateDates = (_, value) => {
    const startDate = form.getFieldValue("startDate");
    if (startDate && value && moment(startDate).isAfter(value)) {
      return Promise.reject(
        new Error("End date cannot be earlier than start date.")
      );
    }
    return Promise.resolve();
  };

  const onFinish = (values) => {
    // Log form values before formatting for debugging
    console.log("Form values before formatting:", values);

    // Safely format the date values
    const formattedValues = {
      ...values,
      startDate: values.startDate
        ? values.startDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        : null,
      endDate: values.endDate
        ? values.endDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        : null,
      farms: [
        {
          id: "farm-id", // Replace with actual farm ID
          farm: {
            id: "farm-id",
            address: "123 Farm Address", // Replace with actual farm address
            phoneNumber: "1234567890", // Replace with actual phone number
            name: "Farm Name", // Replace with actual farm name
            image: "url-to-farm-image", // Replace with actual image URL
            varieties: [
              {
                id: "variety-id", // Replace with actual variety ID
                name: "Koi Variety", // Replace with actual variety name
                description: "Koi description", // Replace with actual description
              },
            ],
          },
          visitDate: values.startDate, // Customize this
          description: values.additionalDetails || "Farm visit", // Add description from form
        },
      ],
    };

    // Log formatted data before making the API request
    console.log("Formatted values:", formattedValues);

    // Call API to save trip details
    axios
      .post("http://localhost:8080/api/trip/create", formattedValues)
      .then((response) => {
        message.success("Trip plan created successfully!");
        navigate("/customer-request", {
          state: {
            ...customer,
            tripPlan: response.data,
            status: "Waiting for Approval",
          },
        });
      })
      .catch((error) => {
        // Log detailed error response if API fails
        console.error(
          "Error creating trip plan:",
          error.response?.data || error.message
        );
        message.error("Failed to create trip plan. Please try again.");
      });
  };

  const handleEdit = () => {
    navigate("/create-trip-plan", { state: { customer } });
  };

  return (
    <div>
      <h2>Create Trip Plan for {customer?.name || "Unknown Customer"}</h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="itinerary"
          label="Itinerary"
          rules={[
            { required: true, message: "Please enter the trip itinerary!" },
          ]}
        >
          <Input.TextArea placeholder="Describe the trip itinerary..." />
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
          dependencies={["startDate"]}
          rules={[
            { required: true, message: "Please select an end date!" },
            { validator: validateDates },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[
            { required: true, message: "Please enter the price for the trip!" },
            {
              type: "number",
              min: 0,
              message: "Price must be a non-negative number!",
            },
          ]}
        >
          <InputNumber
            placeholder="Enter trip price"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="additionalDetails" label="Additional Details">
          <Input.TextArea placeholder="Any additional information?" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit Trip Plan
        </Button>
      </Form>
    </div>
  );
};

export default CreateTripPlan;
