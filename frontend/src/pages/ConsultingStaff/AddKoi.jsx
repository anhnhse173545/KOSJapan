import React, { useState } from "react";
import { Form, Input, Button, message, Upload, Select, Space } from "antd";
import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const AddKoi = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [fileList, setFileList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Extract bookingId and farmId from route parameters or state
  const { bookingId, farmId } = location.state || {};

  const handleSubmit = async (values) => {
    if (!bookingId || !farmId) {
      message.error("Missing booking ID or farm ID.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Fish Order
      const fishOrderResponse = await axios.post(
        `http://localhost:8080/fish-order/${bookingId}/${farmId}/create`
      );
      const fishOrderId = fishOrderResponse.data.id;

      // Loop through fishOrderDetails to create each fish
      for (const fishOrderDetail of values.fishOrderDetails) {
        const { fish } = fishOrderDetail;

        // Step 2: Create fish
        const fishResponse = await axios.post(
          `http://localhost:8080/fish/${fish.variety.name}/create`,
          { ...fish }
        );
        const createdFish = fishResponse.data; // Kiểm tra response trả về ID của cá mới tạo
        if (!createdFish.id) {
          throw new Error("Missing fish ID in the response");
        }

        // Step 3: Create fish order detail
        // Tạo Fish Order Detail
        await axios.post(`http://localhost:8080/order-detail/create`, {
          fishId: createdFish.id,
          fishOrderId, // Đúng là fishOrderId, không phải bookingId
          price: fishOrderDetail.fish_price,
        });
      }

      // Loop through fishPackOrderDetails to create packs and add fish
      for (const fishPackDetail of values.fishPackOrderDetails) {
        // Step 4: Create fish pack
        const fishPackResponse = await axios.post(
          `http://localhost:8080/koi-fish-pack/create`,
          { ...fishPackDetail.fishPack }
        );
        const createdFishPack = fishPackResponse.data;

        // Step 5: Add fish to pack
        for (const fish of fishPackDetail.fishPack.fishes) {
          await axios.post(
            `http://localhost:8080/koi-fish-pack/${createdFishPack.id}/add-fish-to-pack/${fish.id}`
          );
        }

        // Step 6: Create fish pack order detail
        await axios.post(
          `http://localhost:8080/Koi-pack-Order-detail/${fishOrderId}/create`,
          {
            fishPackId: createdFishPack.id,
            price: fishPackDetail.price,
            quantity: fishPackDetail.fishPack.quantity,
          }
        );
      }

      message.success("Koi order created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating order:", error);
      message.error("Failed to create the order.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleVideoChange = ({ fileList }) => {
    setVideoList(fileList);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add New Koi</h2>

      {/* Button to create Fish Order */}
      <Form.Item>
        <Button
          type="primary"
          onClick={async () => {
            if (!bookingId || !farmId) {
              message.error("Missing booking ID or farm ID.");
              return;
            }
            try {
              const fishOrderResponse = await axios.post(
                `http://localhost:8080/fish-order/${bookingId}/${farmId}/create`
              );
              message.success("Fish Order created successfully!");
            } catch (error) {
              console.error("Error creating fish order:", error);
              message.error("Failed to create Fish Order.");
            }
          }}
        >
          Tạo Fish Order
        </Button>
      </Form.Item>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Fish Order Details Section */}
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
                    name={[name, "fish", "id"]}
                    fieldKey={[fieldKey, "fish", "id"]}
                    label="Fish ID"
                    rules={[
                      { required: true, message: "Please enter the Fish ID" },
                    ]}
                  >
                    <Input placeholder="Fish ID" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "fish", "variety", "name"]}
                    fieldKey={[fieldKey, "fish", "variety", "name"]}
                    label="Variety Name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the Variety Name",
                      },
                    ]}
                  >
                    <Input placeholder="Variety Name" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "fish", "length"]}
                    fieldKey={[fieldKey, "fish", "length"]}
                    label="Length (cm)"
                    rules={[
                      { required: true, message: "Please enter the Length" },
                    ]}
                  >
                    <Input placeholder="Length" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "fish", "weight"]}
                    fieldKey={[fieldKey, "fish", "weight"]}
                    label="Weight (kg)"
                    rules={[
                      { required: true, message: "Please enter the Weight" },
                    ]}
                  >
                    <Input placeholder="Weight" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "fish", "description"]}
                    fieldKey={[fieldKey, "fish", "description"]}
                    label="Description"
                  >
                    <Input placeholder="Description" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "fish_price"]}
                    fieldKey={[fieldKey, "fish_price"]}
                    label="Fish Price"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the Fish Price",
                      },
                    ]}
                  >
                    <Input placeholder="Fish Price" />
                  </Form.Item>

                  {/* Button to create Fish */}
                  <Button
                    type="primary"
                    onClick={async () => {
                      const { fish } = form.getFieldValue([
                        "fishOrderDetails",
                        key,
                        "fish",
                      ]);
                      try {
                        const fishResponse = await axios.post(
                          `http://localhost:8080/fish/${fish.variety.name}/create`,
                          { ...fish }
                        );
                        message.success("Fish created successfully!");
                      } catch (error) {
                        console.error("Error creating fish:", error);
                        message.error("Failed to create fish.");
                      }
                    }}
                  >
                    Tạo Fish
                  </Button>

                  {/* Button to create Order Detail */}
                  <Button
                    type="primary"
                    onClick={async () => {
                      const { fish_price } = form.getFieldValue([
                        "fishOrderDetails",
                        key,
                      ]);
                      const fish = form.getFieldValue([
                        "fishOrderDetails",
                        key,
                        "fish",
                      ]);
                      try {
                        await axios.post(
                          `http://localhost:8080/order-detail/create`,
                          {
                            fishId: fish.id,
                            fishOrderId: bookingId,
                            price: fish_price,
                          }
                        );
                        message.success(
                          "Fish Order Detail created successfully!"
                        );
                      } catch (error) {
                        console.error(
                          "Error creating fish order detail:",
                          error
                        );
                        message.error("Failed to create Fish Order Detail.");
                      }
                    }}
                  >
                    Tạo Fish Order Detail
                  </Button>

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
                  Add Fish Order Detail
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Fish Pack Order Details Section */}
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
                    name={[name, "fishPack", "id"]}
                    fieldKey={[fieldKey, "fishPack", "id"]}
                    label="Fish Pack ID"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the Fish Pack ID",
                      },
                    ]}
                  >
                    <Input placeholder="Fish Pack ID" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "fishPack", "quantity"]}
                    fieldKey={[fieldKey, "fishPack", "quantity"]}
                    label="Quantity"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the Quantity",
                      },
                    ]}
                  >
                    <Input placeholder="Quantity" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "fishPack", "fishes"]}
                    fieldKey={[fieldKey, "fishPack", "fishes"]}
                    label="Fish IDs in Pack"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the Fish IDs in the Pack",
                      },
                    ]}
                  >
                    <Input placeholder="Fish IDs in Pack" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "price"]}
                    fieldKey={[fieldKey, "price"]}
                    label="Price"
                    rules={[
                      { required: true, message: "Please enter the Price" },
                    ]}
                  >
                    <Input placeholder="Price" />
                  </Form.Item>

                  {/* Button to create Fish Pack */}
                  <Button
                    type="primary"
                    onClick={async () => {
                      const fishPack = form.getFieldValue([
                        "fishPackOrderDetails",
                        key,
                        "fishPack",
                      ]);
                      try {
                        const fishPackResponse = await axios.post(
                          `http://localhost:8080/koi-fish-pack/create`,
                          { ...fishPack }
                        );
                        message.success("Fish Pack created successfully!");
                      } catch (error) {
                        console.error("Error creating fish pack:", error);
                        message.error("Failed to create Fish Pack.");
                      }
                    }}
                  >
                    Tạo Fish Pack
                  </Button>

                  {/* Button to Add Fish to Pack */}
                  <Button
                    type="primary"
                    onClick={async () => {
                      const fishPack = form.getFieldValue([
                        "fishPackOrderDetails",
                        key,
                        "fishPack",
                      ]);
                      try {
                        for (const fish of fishPack.fishes) {
                          await axios.post(
                            `http://localhost:8080/koi-fish-pack/${createdFishPack.id}/add-fish-to-pack/${fish.id}`
                          );
                        }
                        message.success("Fish added to Pack successfully!");
                      } catch (error) {
                        console.error("Error adding fish to pack:", error);
                        message.error("Failed to add Fish to Pack.");
                      }
                    }}
                  >
                    Add Fish to Pack
                  </Button>

                  {/* Button to create Fish Pack Order Detail */}
                  <Button
                    type="primary"
                    onClick={async () => {
                      const fishPack = form.getFieldValue([
                        "fishPackOrderDetails",
                        key,
                        "fishPack",
                      ]);
                      const { price } = form.getFieldValue([
                        "fishPackOrderDetails",
                        key,
                      ]);
                      try {
                        await axios.post(
                          `http://localhost:8080/Koi-pack-Order-detail/${bookingId}/create`,
                          {
                            fishPackId: fishPack.id,
                            price,
                            quantity: fishPack.quantity,
                          }
                        );
                        message.success(
                          "Fish Pack Order Detail created successfully!"
                        );
                      } catch (error) {
                        console.error(
                          "Error creating fish pack order detail:",
                          error
                        );
                        message.error(
                          "Failed to create Fish Pack Order Detail."
                        );
                      }
                    }}
                  >
                    Tạo Fish Pack Order Detail
                  </Button>

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
                  Add Fish Pack Order Detail
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddKoi;
