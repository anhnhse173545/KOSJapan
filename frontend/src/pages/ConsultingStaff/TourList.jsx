import React, { useState, useEffect } from "react";
import { Table, Button, message, Select, Space } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const TourList = () => {
  const [tourData, setTourData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTourData();
  }, []);

  const fetchTourData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/booking/consulting-staff/AC0004"
      );
      const formattedData = response.data.map((item, index) => ({
        key: index + 1,
        bookingId: item.id,
        tripId: item.trip.id,
        customer: item.customer.name,
        startDate: item.trip.startDate,
        endDate: item.trip.endDate,
        bookingStatus: item.status,
        tripStatus: item.trip.status,
      }));
      setTourData(formattedData);
    } catch (error) {
      console.error("Error fetching tour data:", error);
      message.error("Failed to load data from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    bookingId,
    newBookingStatus,
    newTripStatus
  ) => {
    const updatedData = tourData.map((tour) =>
      tour.bookingId === bookingId
        ? {
            ...tour,
            bookingStatus: newBookingStatus,
            tripStatus: newTripStatus,
          }
        : tour
    );
    setTourData(updatedData);

    try {
      // Update the booking status
      await axios.put(`http://localhost:8080/api/booking/update/${bookingId}`, {
        status: newBookingStatus,
      });

      // Update the trip status
      await axios.put(
        `http://localhost:8080/api/trip/update/${
          updatedData.find((tour) => tour.bookingId === bookingId).tripId
        }`,
        {
          status: newTripStatus,
        }
      );

      message.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status");
      fetchTourData(); // Refetch data to restore original state
    }
  };

  const handleViewDetails = (bookingId) => {
    navigate(`/tour-details/${bookingId}`);
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      sorter: (a, b) => a.bookingId.localeCompare(b.bookingId),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
      title: "Booking Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      filters: [
        { text: "On-going", value: "On-going" },
        { text: "Paid Booking", value: "Paid Booking" },
        { text: "Order Prepare", value: "Order Prepare" },
      ],
      onFilter: (value, record) => record.bookingStatus.includes(value),
      render: (text, record) => (
        <Select
          value={text}
          style={{ width: 150 }}
          onChange={(value) =>
            handleStatusChange(record.bookingId, value, record.tripStatus)
          }
        >
          <Option value="On-going">On-going</Option>
          <Option value="Paid Booking">Paid Booking</Option>
          <Option value="Order Prepare">Order Prepare</Option>
        </Select>
      ),
    },
    {
      title: "Trip Status",
      dataIndex: "tripStatus",
      key: "tripStatus",
      filters: [
        { text: "Approved", value: "Approved" },
        { text: "On-going", value: "On-going" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.tripStatus.includes(value),
      render: (text, record) => (
        <Select
          value={text}
          style={{ width: 150 }}
          onChange={(value) =>
            handleStatusChange(record.bookingId, record.bookingStatus, value)
          }
        >
          <Option value="Approved">Approved</Option>
          <Option value="On-going">On-going</Option>
          <Option value="Completed">Completed</Option>
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleViewDetails(record.bookingId)}
        >
          More
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <h1>Customer Tour List</h1>
        <Table
          columns={columns}
          dataSource={tourData}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </Space>
    </div>
  );
};

export default TourList;