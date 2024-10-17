import React, { useState } from "react";
import { Form, Input, Button, message, Space, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const AddKoi = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract orderId from location state
  const { orderId } = location.state || {};

  // Submit Fish and Order Details
  // Submit Fish and Order Details
  const handleSubmit = async (values) => {
    if (!orderId) {
      message.error("Missing order ID.");
      return;
    }

    try {
      setLoading(true);

      // Loop through fishOrderDetails and call the API for each fish
      for (const fishOrderDetail of values.fishOrderDetails) {
        const payload = {
          variety_id: fishOrderDetail.variety_id,
          length: fishOrderDetail.length,
          weight: fishOrderDetail.weight,
          description: fishOrderDetail.description,
          orderId: orderId, // Use the orderId from previous page
          price: fishOrderDetail.price, // Add price for the fish
        };

        // Log the payload before sending
        console.log("Payload to send:", payload);

        // API call to create fish and order detail
        await axios.post(
          "http://localhost:8080/order-detail/create-fish-and-order-detail",
          payload
        );
      }

      message.success("Fish and order details created successfully!");
      navigate("/OrderList"); // Navigate to OrderList.jsx after success
    } catch (error) {
      console.error(
        "Error creating fish and order details:",
        error.response || error
      );
      message.error(
        "Failed to create fish and order details: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Fish Details</h2>

      {/* Form to add fish and order details */}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.List name="fishOrderDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  {/* Variety ID */}
                  <Form.Item
                    {...restField}
                    name={[name, "variety_id"]}
                    fieldKey={[fieldKey, "variety_id"]}
                    label="Variety ID"
                    rules={[
                      { required: true, message: "Please select Variety ID" },
                    ]}
                  >
                    <Select placeholder="Select Variety ID">
                      <Option value="VA0001">VA0001</Option>
                      <Option value="VA0002">VA0002</Option>
                      <Option value="VA0003">VA0003</Option>
                      <Option value="VA0004">VA0004</Option>
                      <Option value="VA0005">VA0005</Option>
                    </Select>
                  </Form.Item>

                  {/* Length */}
                  <Form.Item
                    {...restField}
                    name={[name, "length"]}
                    fieldKey={[fieldKey, "length"]}
                    label="Length (cm)"
                    rules={[{ required: true, message: "Please enter Length" }]}
                  >
                    <Input placeholder="Length" type="number" />
                  </Form.Item>

                  {/* Weight */}
                  <Form.Item
                    {...restField}
                    name={[name, "weight"]}
                    fieldKey={[fieldKey, "weight"]}
                    label="Weight (kg)"
                    rules={[{ required: true, message: "Please enter Weight" }]}
                  >
                    <Input placeholder="Weight" type="number" />
                  </Form.Item>

                  {/* Description */}
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    fieldKey={[fieldKey, "description"]}
                    label="Description"
                  >
                    <Input placeholder="Description" />
                  </Form.Item>

                  {/* Price */}
                  <Form.Item
                    {...restField}
                    name={[name, "price"]}
                    fieldKey={[fieldKey, "price"]}
                    label="Price"
                    rules={[{ required: true, message: "Please enter Price" }]}
                  >
                    <Input placeholder="Price" type="number" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Fish
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit Fish Details
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddKoi;
