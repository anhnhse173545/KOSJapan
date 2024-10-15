import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateTripPlan = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { customer } = location.state; // Receive customer data from state

  const handleSubmit = (values) => {
    // Constructing the trip destination object based on the provided sample structure
    const tripDestination = {
      id: values.destinationId,
      farm: {
        id: values.farmId,
        address: values.farmAddress,
        phoneNumber: values.farmPhoneNumber,
        name: values.farmName,
        image: values.farmImage || null, // Handle optional image
        varieties: values.varieties.map((variety) => ({
          id: variety.id,
          name: variety.name,
          description: variety.description,
        })),
      },
      visitDate: values.visitDate ? values.visitDate.toISOString() : null,
      description: values.destinationDescription || null,
    };

    // Fetch the tripId from the customer or specify how to get it
    const tripId = customer.trip.id; // Assuming this structure, adjust as needed

    // Send trip destination data to API
    axios
      .post(
        `http://localhost:8080/api/trip-destination/${tripId}/create`,
        tripDestination
      )
      .then(() => {
        message.success("Trip destination created successfully!");
        navigate("/"); // Redirect after successful creation
      })
      .catch((error) => {
        console.error(
          "Failed to create trip destination:",
          error.response || error
        );
        message.error("Failed to create trip destination.");
      });
  };

  return (
    <div>
      <h2>Create Trip Plan for {customer.customer.name}</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="destinationId"
          label="Destination ID"
          rules={[
            { required: true, message: "Please enter a destination ID!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="farmId"
          label="Farm ID"
          rules={[{ required: true, message: "Please enter a farm ID!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="farmName"
          label="Farm Name"
          rules={[{ required: true, message: "Please enter the farm name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="farmAddress"
          label="Farm Address"
          rules={[
            { required: true, message: "Please enter the farm address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="farmPhoneNumber"
          label="Farm Phone Number"
          rules={[
            { required: true, message: "Please enter the farm phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="farmImage" label="Farm Image URL">
          <Input />
        </Form.Item>

        <h3>Koi Varieties</h3>
        {/* Dynamic Fields for Varieties */}
        <Form.List name="varieties">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, instanceKey }) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <Form.Item
                    label="Variety Name"
                    name={[name, "name"]}
                    fieldKey={[fieldKey, "name"]}
                    rules={[
                      { required: true, message: "Please enter variety name!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Variety ID"
                    name={[name, "id"]}
                    fieldKey={[fieldKey, "id"]}
                    rules={[
                      { required: true, message: "Please enter variety ID!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Variety Description"
                    name={[name, "description"]}
                    fieldKey={[fieldKey, "description"]}
                    rules={[
                      {
                        required: true,
                        message: "Please enter variety description!",
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Button type="link" onClick={() => remove(name)}>
                    Remove Variety
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add Variety
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="visitDate" label="Visit Date">
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          name="destinationDescription"
          label="Destination Description"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Trip Destination
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTripPlan;
