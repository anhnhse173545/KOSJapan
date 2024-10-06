import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Badge, Table, Button, Input, InputNumber, message } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";

const initialExpandData = {
  1: [
    {
      key: "1-1",
      date: "2024-09-29 12:30:00",
      koi: "Koi A",
      breeder: "Breeder A", // New breeder field
      price: 100,
      quantity: 2,
      total: 200,
      isNew: false,
    },
  ],
  2: [
    {
      key: "2-1",
      date: "2024-09-30 15:00:00",
      koi: "Koi B",
      breeder: "Breeder B", // New breeder field
      price: 150,
      quantity: 1,
      total: 150,
      isNew: false,
    },
  ],
};

const dataSource = [
  {
    key: "1",
    tripId: "TRIP123",
    customer: "John Doe",
    startDate: "2024-09-29",
    endDate: "2024-09-30",
    price: 200,
    paymentMethod: "Credit Card",
    status: "Paid",
  },
  {
    key: "2",
    tripId: "TRIP124",
    customer: "Jane Smith",
    startDate: "2024-09-30",
    endDate: "2024-10-01",
    price: 150,
    paymentMethod: "PayPal",
    status: "Not Paid",
  },
];

const columns = [
  {
    title: "Trip ID",
    dataIndex: "tripId",
    key: "tripId",
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (text) => `$${text}`,
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => {
      let statusColor = text === "Paid" ? "success" : "error";
      return <Badge status={statusColor} text={text} />;
    },
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <>
        <Button
          type="primary"
          disabled={record.status === "Paid"}
          onClick={() => handleStatusChange(record.key)}
          style={{ marginRight: 8 }}
        >
          Mark as Paid
        </Button>
        <Button
          type="default"
          onClick={() => handleExportToPDF(record)}
          style={{ marginRight: 8 }}
        >
          Export to PDF
        </Button>
        <Button
          type="default"
          onClick={() => handleSendToDelivery(record.key)}
          disabled={record.deliverySent}
        >
          Send to Delivery
        </Button>
      </>
    ),
  },
];

const expandColumns = (
  handleInputChange,
  handleSaveNewOrder,
  expandKey,
  handleEdit
) => [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (text, record, index) =>
      record.isNew || record.isEditing ? (
        <Input
          value={text}
          onChange={(e) =>
            handleInputChange(expandKey, index, "date", e.target.value)
          }
        />
      ) : (
        text
      ),
  },
  {
    title: "Koi",
    dataIndex: "koi",
    key: "koi",
    render: (text, record, index) =>
      record.isNew || record.isEditing ? (
        <Input
          value={text}
          onChange={(e) =>
            handleInputChange(expandKey, index, "koi", e.target.value)
          }
        />
      ) : (
        text
      ),
  },
  {
    title: "Breeder", // New breeder column
    dataIndex: "breeder",
    key: "breeder",
    render: (text, record, index) =>
      record.isNew || record.isEditing ? (
        <Input
          value={text}
          onChange={(e) =>
            handleInputChange(expandKey, index, "breeder", e.target.value)
          }
        />
      ) : (
        text
      ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    render: (text, record, index) =>
      record.isNew || record.isEditing ? (
        <InputNumber
          value={text}
          min={1}
          onChange={(value) =>
            handleInputChange(expandKey, index, "quantity", value)
          }
        />
      ) : (
        text
      ),
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text, record) => `$${record.price * record.quantity || 0}`,
  },
  {
    title: "Action",
    key: "operation",
    render: (text, record, index) =>
      record.isNew || record.isEditing ? (
        <Button
          type="link"
          onClick={() => handleSaveNewOrder(expandKey, index)}
        >
          Save
        </Button>
      ) : (
        <Button type="link" onClick={() => handleEdit(expandKey, index)}>
          Edit
        </Button>
      ),
  },
];

const AddKoi = () => {
  const [expandedOrders, setExpandedOrders] = useState(initialExpandData);
  const [dataSourceState, setDataSourceState] = useState(dataSource);

  const handleStatusChange = (key) => {
    const updatedDataSource = dataSourceState.map((order) => {
      if (order.key === key && order.status === "Not Paid") {
        return { ...order, status: "Paid" };
      }
      return order;
    });
    setDataSourceState(updatedDataSource);
    message.success("Status changed to Paid.");
  };

  const handleSendToDelivery = (key) => {
    const updatedDataSource = dataSourceState.map((order) => {
      if (order.key === key) {
        return { ...order, deliverySent: true };
      }
      return order;
    });
    setDataSourceState(updatedDataSource);
    message.success("Order sent to delivery.");
  };

  const handleInputChange = (expandKey, index, field, value) => {
    const updatedOrders = { ...expandedOrders };
    updatedOrders[expandKey][index][field] = value;

    if (field === "price" || field === "quantity") {
      const { price = 0, quantity = 1 } = updatedOrders[expandKey][index];
      updatedOrders[expandKey][index].total = price * quantity;
    }

    setExpandedOrders(updatedOrders);
  };

  const handleAddNewOrder = (expandKey) => {
    const newOrder = {
      key: `${expandKey}-${Date.now()}`,
      date: "",
      koi: "",
      breeder: "", // Include the breeder field
      price: 0,
      quantity: 1,
      total: 0,
      isNew: true,
    };
    const updatedOrders = { ...expandedOrders };
    updatedOrders[expandKey] = [...updatedOrders[expandKey], newOrder];
    setExpandedOrders(updatedOrders);
  };

  const handleEdit = (expandKey, index) => {
    const updatedOrders = { ...expandedOrders };
    updatedOrders[expandKey][index].isEditing = true;
    setExpandedOrders(updatedOrders);
  };

  const handleSaveNewOrder = (expandKey, index) => {
    const updatedOrders = { ...expandedOrders };

    const { date, koi, breeder, price, quantity } =
      updatedOrders[expandKey][index];
    if (!date || !koi || !breeder || price <= 0 || quantity <= 0) {
      message.error("Please fill out all fields and provide valid inputs.");
      return;
    }

    updatedOrders[expandKey][index].isNew = false;
    updatedOrders[expandKey][index].isEditing = false;

    const totalPrice = updatedOrders[expandKey].reduce(
      (acc, order) => acc + order.total,
      0
    );
    const updatedDataSource = [...dataSourceState];
    const mainOrderIndex = updatedDataSource.findIndex(
      (order) => order.key === expandKey
    );
    updatedDataSource[mainOrderIndex].price = totalPrice;

    setExpandedOrders(updatedOrders);
    setDataSourceState(updatedDataSource);
  };

  const handleExportToPDF = (record) => {
    const doc = new jsPDF();
    doc.text(`Trip ID: ${record.tripId}`, 10, 10);
    doc.text(`Customer: ${record.customer}`, 10, 20);
    doc.text(`Start Date: ${record.startDate}`, 10, 30);
    doc.text(`End Date: ${record.endDate}`, 10, 40);
    doc.text(`Price: $${record.price}`, 10, 60);
    doc.text(`Payment Method: ${record.paymentMethod}`, 10, 70);
    doc.text(`Status: ${record.status}`, 10, 80);

    const expandedData = expandedOrders[record.key];
    const tableData = expandedData.map((order) => ({
      date: order.date,
      koi: order.koi,
      breeder: order.breeder, // Include breeder in the export
      quantity: order.quantity,
      total: order.total,
    }));

    doc.autoTable({
      head: [["Date", "Koi", "Breeder", "Quantity", "Total"]],
      body: tableData.map((order) => [
        order.date,
        order.koi,
        order.breeder,
        order.quantity,
        `$${order.total}`,
      ]),
      startY: 90,
    });

    doc.save(`${record.tripId}.pdf`);
  };

  const expandedRowRender = (expandKey) => (
    <>
      <Table
        columns={expandColumns(
          handleInputChange,
          handleSaveNewOrder,
          expandKey,
          handleEdit
        )}
        dataSource={expandedOrders[expandKey]}
        pagination={false}
      />
      <Button
        type="dashed"
        onClick={() => handleAddNewOrder(expandKey)}
        style={{ marginTop: 16 }}
        icon={<PlusOutlined />}
      >
        New Order
      </Button>
    </>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order List</h1>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record.key),
          defaultExpandedRowKeys: ["1"],
        }}
        dataSource={dataSourceState}
      />
    </div>
  );
};

export default AddKoi;
