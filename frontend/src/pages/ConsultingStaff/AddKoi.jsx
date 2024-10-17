import React, { useState } from "react";
import { Form, Input, Button, message, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AddKoi = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract orderId from location state
  const { orderId } = location.state || {};

  // Submit Fish and Order Details
  const handleSubmit = async (values) => {
    if (!orderId) {
      message.error("Missing order ID.");
      return;
    }

    // Validate that all necessary IDs are provided
    for (const fishOrderDetail of values.fishOrderDetails) {
      const fishId = fishOrderDetail.fish.id;
      const varietyId = fishOrderDetail.fish.variety.id;

      if (!fishId || !varietyId) {
        message.error("Fish ID and Variety ID must not be null.");
        return;
      }
    }

    try {
      setLoading(true);

      // Loop through fishOrderDetails and call the API for each fish
      for (const fishOrderDetail of values.fishOrderDetails) {
        // Log the payload before sending
        console.log("Payload to send:", {
          fish: {
            id: fishOrderDetail.fish.id,
            variety: {
              id: fishOrderDetail.fish.variety.id,
              name: fishOrderDetail.fish.variety.name,
              description: fishOrderDetail.fish.variety.description,
              isDeleted: false,
            },
            length: fishOrderDetail.fish.length,
            weight: fishOrderDetail.fish.weight,
            description: fishOrderDetail.fish.description,
            isDeleted: false,
            medias: [],
          },
          orderDetail: {
            orderId: orderId, // Use the orderId from previous page
            price: fishOrderDetail.price, // Add price for the fish
          },
        });

        // API call to create fish and order detail
        await axios.post(
          `http://localhost:8080/order-detail/create-fish-and-order-detail`,
          {
            fish: {
              id: fishOrderDetail.fish.id,
              variety: {
                id: fishOrderDetail.fish.variety.id,
                name: fishOrderDetail.fish.variety.name,
                description: fishOrderDetail.fish.variety.description,
                isDeleted: false,
              },
              length: fishOrderDetail.fish.length,
              weight: fishOrderDetail.fish.weight,
              description: fishOrderDetail.fish.description,
              isDeleted: false,
              medias: [],
            },
            orderDetail: {
              orderId: orderId, // Use the orderId from previous page
              price: fishOrderDetail.price, // Add price for the fish
            },
          }
        );
      }

      message.success("Fish and order details created successfully!");
      navigate("/"); // Navigate to another page after success
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
                  {/* Fish ID */}
                  <Form.Item
                    {...restField}
                    name={[name, "fish", "id"]}
                    fieldKey={[fieldKey, "fish", "id"]}
                    label="Fish ID"
                    rules={[
                      { required: true, message: "Please enter Fish ID" },
                    ]}
                  >
                    <Input placeholder="Fish ID" />
                  </Form.Item>

                  {/* Variety ID */}
                  <Form.Item
                    {...restField}
                    name={[name, "fish", "variety", "id"]}
                    fieldKey={[fieldKey, "fish", "variety", "id"]}
                    label="Variety ID"
                    rules={[
                      { required: true, message: "Please enter Variety ID" },
                    ]}
                  >
                    <Input placeholder="Variety ID" />
                  </Form.Item>

                  {/* Variety Name */}
                  <Form.Item
                    {...restField}
                    name={[name, "fish", "variety", "name"]}
                    fieldKey={[fieldKey, "fish", "variety", "name"]}
                    label="Variety Name"
                    rules={[
                      { required: true, message: "Please enter Variety Name" },
                    ]}
                  >
                    <Input placeholder="Variety Name" />
                  </Form.Item>

                  {/* Length */}
                  <Form.Item
                    {...restField}
                    name={[name, "fish", "length"]}
                    fieldKey={[fieldKey, "fish", "length"]}
                    label="Length (cm)"
                    rules={[{ required: true, message: "Please enter Length" }]}
                  >
                    <Input placeholder="Length" />
                  </Form.Item>

                  {/* Weight */}
                  <Form.Item
                    {...restField}
                    name={[name, "fish", "weight"]}
                    fieldKey={[fieldKey, "fish", "weight"]}
                    label="Weight (kg)"
                    rules={[{ required: true, message: "Please enter Weight" }]}
                  >
                    <Input placeholder="Weight" />
                  </Form.Item>

                  {/* Description */}
                  <Form.Item
                    {...restField}
                    name={[name, "fish", "description"]}
                    fieldKey={[fieldKey, "fish", "description"]}
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
                    <Input placeholder="Price" />
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
