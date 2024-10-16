import React, { useState, useEffect } from "react";
import { Table, Button, message, Badge } from "antd";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // For API requests

const OrderList = () => {
  const [data, setData] = useState([]); // Data fetched from API
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Fetch data for a specific customer
  const fetchCustomerData = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/booking/customer/${customerId}`
      );
      return response.data; // Assuming the API returns data in response.data
    } catch (error) {
      console.error("Error fetching customer data:", error);
      message.error("Failed to load customer data.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const customerIds = ["1", "2", "3"]; // Replace with real customer IDs
      const promises = customerIds.map((id) => fetchCustomerData(id)); // Fetch data for each customer
      const allData = await Promise.all(promises); // Wait for all API calls to finish
      setData(allData);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleEditKoi = (updatedKoi) => {
    // Update Koi details in the main data
    const updatedData = data.map((trip) => {
      const updatedKoiDetails = trip.koiDetails.map((koi) => {
        if (koi.koi === updatedKoi.koi) {
          return { ...koi, ...updatedKoi }; // Merge updated details
        }
        return koi;
      });
      return { ...trip, koiDetails: updatedKoiDetails };
    });
    setData(updatedData);
    message.success("Koi details updated successfully.");
  };

  const handleAddKoi = (tripId, newKoi) => {
    const updatedData = data.map((trip) => {
      if (trip.tripId === tripId) {
        return { ...trip, koiDetails: [...trip.koiDetails, newKoi] };
      }
      return trip;
    });
    setData(updatedData);
  };

  const handleMarkAsPaid = (tripKey, koiKey) => {
    const updatedData = data.map((trip) => {
      if (trip.key === tripKey) {
        const updatedKoiDetails = trip.koiDetails.map((koi) => {
          if (koi.koi === koiKey && koi.status === "Not Pay Yet") {
            return { ...koi, status: "Paid" };
          }
          return koi;
        });
        return { ...trip, koiDetails: updatedKoiDetails };
      }
      return trip;
    });
    setData(updatedData);
    message.success("Koi status changed to Paid.");
  };

  const handleSendToDelivery = (tripKey, koiKey) => {
    message.success(`Koi ${koiKey} from trip ID ${tripKey} sent to delivery.`);
  };

  const expandedRowRender = (record) => {
    const expandedColumns = [
      { title: "Breeder", dataIndex: "breeder", key: "breeder" },
      { title: "Date", dataIndex: "date", key: "date" },
      { title: "Koi", dataIndex: "koi", key: "koi" },
      { title: "Type", dataIndex: "type", key: "type" },
      { title: "Price", dataIndex: "price", key: "price" },
      {
        title: "Payment Method",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusColor = status === "Paid" ? "success" : "warning";
          return <Badge status={statusColor} text={status} />;
        },
      },
      {
        title: "Action",
        key: "action",
        render: (_, koiRecord) => (
          <>
            <Button
              type="primary"
              disabled={koiRecord.status === "Paid"}
              onClick={() => handleMarkAsPaid(record.key, koiRecord.koi)}
              style={{ marginRight: 8 }}
            >
              {koiRecord.status === "Paid" ? "Paid" : "Mark as Paid"}
            </Button>
            <Button
              type="default"
              onClick={() => handleSendToDelivery(record.key, koiRecord.koi)}
              disabled={koiRecord.status !== "Paid"}
            >
              Send to Delivery
            </Button>
            <Button
              type="link"
              onClick={() =>
                navigate("/koi-details", { state: { koi: koiRecord } })
              }
              style={{ marginLeft: 8 }}
            >
              More
            </Button>
          </>
        ),
      },
    ];

    return (
      <div>
        <Table
          columns={expandedColumns}
          dataSource={record.koiDetails}
          pagination={false}
          rowKey={(row) => row.koi}
        />
        <Button
          type="primary"
          onClick={() =>
            navigate("/add-koi", { state: { tripId: record.tripId } })
          }
          style={{ marginTop: 16 }}
        >
          Add New Koi
        </Button>
      </div>
    );
  };

  const columns = [
    { title: "Trip ID", dataIndex: "tripId", key: "tripId" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    {
      title: "Price",
      key: "price",
      render: (_, record) => (
        <span>
          {record.koiDetails.reduce((total, koi) => total + koi.price, 0)}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>On-Going Order List</h1>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: expandedRowRender,
        }}
        rowKey="tripId"
        loading={loading} // Show loading spinner while data is being fetched
      />
    </div>
  );
};

export default OrderList;
