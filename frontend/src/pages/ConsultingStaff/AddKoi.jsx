import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Space, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const AddKoi = () => {
  const [loading, setLoading] = useState(false);
  const [varieties, setVarieties] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const { orderId } = location.state || {};

  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/variety/list"
        );
        setVarieties(response.data);
      } catch (error) {
        console.error("Error fetching variety list:", error);
        message.error(
          "Failed to fetch variety list: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    fetchVarieties();
  }, []);

  const handleSubmit = async (values) => {
    if (!orderId) {
      message.error(
        "Missing order ID. Please ensure you navigated here correctly."
      );
      return;
    }

    setLoading(true);

    try {
      // Add individual fish
      for (const fishOrderDetail of values.fishOrderDetails || []) {
        const payload = {
          variety_id: fishOrderDetail.variety_id,
          length: fishOrderDetail.length,
          weight: fishOrderDetail.weight,
          description: fishOrderDetail.description,
          orderId: orderId,
          price: fishOrderDetail.price,
        };

        console.log("Fish Payload to send:", payload);

        await axios.post(
          "http://localhost:8080/order-detail/create-fish-and-order-detail",
          payload
        );
      }

      // Add fish packs
      for (const fishPackOrderDetail of values.fishPackOrderDetails || []) {
        const payload = {
          orderId: orderId,
          varietyId: fishPackOrderDetail.variety_id,
          length: fishPackOrderDetail.length,
          weight: fishPackOrderDetail.weight,
          description: fishPackOrderDetail.description,
          quantity: fishPackOrderDetail.quantity,
          packOrderDetailPrice: fishPackOrderDetail.packOrderDetailPrice,
        };

        console.log("Fish Pack Payload to send:", payload);

        await axios.post(
          "http://localhost:8080/Koi-pack-Order-detail/create-fish-pack-and-fish-pack-order-detail",
          payload
        );
      }

      message.success(
        "Fish, Fish Packs, and order details created successfully!"
      );
      navigate("/cs-dashboard/order-list");
    } catch (error) {
      console.error(
        "Error creating fish, fish packs, and order details:",
        error
      );

      let errorMessage =
        "Failed to create fish, fish packs, and order details: ";
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage +=
          error.response.data?.message ||
          error.response.data ||
          error.response.statusText;
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage +=
          "No response received from server. Please check your network connection.";
        console.error("Request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage += error.message;
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Fish and Fish Pack Details</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <h3>Add Fish</h3>
        <Form.List name="fishOrderDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
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
                      {varieties.map((variety) => (
                        <Option key={variety.id} value={variety.id}>
                          {variety.id} - {variety.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "length"]}
                    fieldKey={[fieldKey, "length"]}
                    label="Length (cm)"
                    rules={[{ required: true, message: "Please enter Length" }]}
                  >
                    <Input placeholder="Length" type="number" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "weight"]}
                    fieldKey={[fieldKey, "weight"]}
                    label="Weight (kg)"
                    rules={[{ required: true, message: "Please enter Weight" }]}
                  >
                    <Input placeholder="Weight" type="number" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    fieldKey={[fieldKey, "description"]}
                    label="Description"
                  >
                    <Input placeholder="Description" />
                  </Form.Item>

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

        <h3>Add Fish Pack</h3>
        <Form.List name="fishPackOrderDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
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
                      {varieties.map((variety) => (
                        <Option key={variety.id} value={variety.id}>
                          {variety.id} - {variety.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "length"]}
                    fieldKey={[fieldKey, "length"]}
                    label="Length (cm)"
                    rules={[{ required: true, message: "Please enter Length" }]}
                  >
                    <Input placeholder="Length" type="number" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "weight"]}
                    fieldKey={[fieldKey, "weight"]}
                    label="Weight (kg)"
                    rules={[{ required: true, message: "Please enter Weight" }]}
                  >
                    <Input placeholder="Weight" type="number" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    fieldKey={[fieldKey, "description"]}
                    label="Description"
                  >
                    <Input placeholder="Description" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    fieldKey={[fieldKey, "quantity"]}
                    label="Quantity"
                    rules={[
                      { required: true, message: "Please enter Quantity" },
                    ]}
                  >
                    <Input placeholder="Quantity" type="number" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "packOrderDetailPrice"]}
                    fieldKey={[fieldKey, "packOrderDetailPrice"]}
                    label="Pack Price"
                    rules={[
                      { required: true, message: "Please enter Pack Price" },
                    ]}
                  >
                    <Input placeholder="Pack Price" type="number" />
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
                  Add Fish Pack
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit Fish and Fish Pack Details
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddKoi;
