import { Form, Input, Table } from "antd";
import { Button, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";

function TaskManagerment() {
  const [visible, setVisible] = useState(false);
  const [formVariable] = useForm();
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
  ];
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      email: "pwry.hsyny@example.com",
      phone: "0146975872",
      start: "30/09/2020",
      end: "20/10/2024",
      request: "Kodama Farm",
    },
    {
      key: "2",
      name: "John",
      email: "ary.shylyrd@example.com",
      phone: "0146975872",
      start: "30/09/2020",
      end: "20/10/2024",
      request: "Kodama Farm",
    },
    {
      key: "3",
      name: "Siri",
      email: "ary.shylyrd@example.com",
      phone: "0146975872",
      start: "30/09/2020",
      end: "20/10/2024",
      request: "Kodama Farm",
    },
  ];
  const handleOpenModal = () => {
    setVisible(true);
  };
  const handleHideOpenModal = () => {
    setVisible(false);
  };
  const handleOk = () => {
    formVariable.submit();
  };
  return (
    <div>
      <h2>Customer info request</h2>
      <Button type="primary" onClick={handleOpenModal}>
        Add new tour
      </Button>
      <Table dataSource={dataSource} columns={columns} />;
      <Modal
        title="Basic Modal"
        open={visible}
        onCancel={handleHideOpenModal}
        onOk={handleOk}
      >
        <Form form={formVariable}>
          <Form.Item
            name={"name"}
            label={"Tour"}
            rules={[
              {
                require: true,
                message: "Hãy điền thông tin tour",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TaskManagerment;
