import {
  Form,
  Input,
  Table,
  Button,
  Modal,
  DatePicker,
  InputNumber,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import dayjs from "dayjs"; // Day.js for date validation

function TaskManagerment() {
  const [visible, setVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null); // State to store which row is being edited
  const [isAdding, setIsAdding] = useState(false); // State to check if adding a new tour
  const [formVariable] = useForm();
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      name: "Mike",
      email: "pwry.hsyny@example.com",
      phone: "0146975872",
      start: "2024-09-30",
      end: "2024-10-20",
      request: "Kodama Farm",
      price: 100,
      constraints: "None",
      description: "None",
    },
    {
      key: "2",
      name: "John",
      email: "ary.shylyrd@example.com",
      phone: "0146975872",
      start: "2024-09-30",
      end: "2024-10-20",
      request: "Kodama Farm",
      price: 150,
      constraints: "None",
      description: "None",
    },
    {
      key: "3",
      name: "Siri",
      email: "ary.shylyrd@example.com",
      phone: "0146975872",
      start: "2024-09-30",
      end: "2024-10-20",
      request: "Kodama Farm",
      price: 1200,
      constraints: "5 people",
      description: "A small group tour for personalized experience.",
    },
  ]);

  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleEdit = (record) => {
    setEditingKey(record.key);
    formVariable.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      start: dayjs(record.start), // Use dayjs for date formatting
      end: dayjs(record.end),
      request: record.request,
      price: record.price,
      constraints: record.constraints,
      description: record.description,
    });
    setVisible(true);
  };

  const handleSaveEdit = () => {
    formVariable.validateFields().then((values) => {
      const newData = dataSource.map((item) => {
        if (item.key === editingKey) {
          return {
            ...item,
            ...values,
            start: values.start.format("YYYY-MM-DD"),
            end: values.end.format("YYYY-MM-DD"),
          };
        }
        return item;
      });
      setDataSource(newData);
      setVisible(false);
      setEditingKey(null);
    });
  };

  const handleAddNewTour = () => {
    formVariable.validateFields().then((values) => {
      const newTour = {
        key: Date.now().toString(), // Generate a unique key
        ...values,
        start: values.start.format("YYYY-MM-DD"), // Format date
        end: values.end.format("YYYY-MM-DD"),
      };
      setDataSource([...dataSource, newTour]);
      setVisible(false);
      formVariable.resetFields();
      setIsAdding(false);
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
    },
    {
      title: "Request",
      dataIndex: "request",
      key: "request",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`, // Display price in dollars
    },
    {
      title: "Constraints",
      dataIndex: "constraints",
      key: "constraints",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.key)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleOpenModal = () => {
    setIsAdding(true);
    formVariable.resetFields(); // Reset the form for a new entry
    setVisible(true);
  };

  const handleHideOpenModal = () => {
    setVisible(false);
    setEditingKey(null);
    setIsAdding(false);
    formVariable.resetFields();
  };

  return (
    <div>
      <h2>Customer Info Request</h2>
      <Button type="primary" onClick={handleOpenModal}>
        Add New Tour
      </Button>
      <Table dataSource={dataSource} columns={columns} />
      <Modal
        title={editingKey ? "Edit Tour" : "Add New Tour"}
        open={visible}
        onCancel={handleHideOpenModal}
        onOk={editingKey ? handleSaveEdit : handleAddNewTour} // Conditionally handle adding or editing
      >
        <Form form={formVariable}>
          <Form.Item
            name={"name"}
            label={"Name"}
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"email"}
            label={"Email"}
            rules={[
              {
                required: true,
                message: "Please enter a valid email",
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"phone"}
            label={"Phone"}
            rules={[
              {
                required: true,
                message: "Please enter a valid phone number",
                pattern: /^[0-9]{10,12}$/, // Accept phone numbers between 10 and 12 digits
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"start"}
            label={"Start Date"}
            rules={[
              { required: true, message: "Please enter the start date" },
              {
                validator: (_, value) =>
                  value && value.isBefore(dayjs(), "day")
                    ? Promise.reject(
                        new Error("Start date cannot be in the past")
                      )
                    : Promise.resolve(),
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name={"end"}
            label={"End Date"}
            rules={[
              { required: true, message: "Please enter the end date" },
              {
                validator: (_, value) => {
                  const startDate = formVariable.getFieldValue("start");
                  if (!startDate || !value) return Promise.resolve();
                  return value.isBefore(startDate)
                    ? Promise.reject(
                        new Error("End date cannot be before the start date")
                      )
                    : Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name={"request"}
            label={"Request"}
            rules={[{ required: true, message: "Please enter the request" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"price"}
            label={"Price ($)"}
            rules={[{ required: true, message: "Please enter the price" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name={"constraints"}
            label={"Constraints"}
            rules={[
              { required: true, message: "Please enter any constraints" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"description"}
            label={"Description"}
            rules={[
              { required: true, message: "Please enter the tour description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TaskManagerment;
