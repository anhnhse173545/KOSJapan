import { useState, useEffect } from "react";
import { Table, Button, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";

const { Option } = Select;

const TourList = () => {
  const [tourData, setTourData] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("ascend");
  const [sortBy, setSortBy] = useState("startDate");
  const navigate = useNavigate();

  // Fetch data from the API
  useEffect(() => {
    const savedData = localStorage.getItem("tourData");
    if (savedData) {
      setTourData(JSON.parse(savedData));
    } else {
      fetchTourData();
    }
  }, []);

  const fetchTourData = () => {
    axios
      .get("http://localhost:8080/api/booking/consulting-staff/AC0004")
      .then((response) => {
        const data = response.data;
        setTourData(
          data.map((item, index) => ({
            key: index + 1,
            bookingId: item.id,
            customer: item.customer.name,
            startDate: item.trip.startDate,
            endDate: item.trip.endDate,
            status: item.trip.status,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching tour data:", error);
        message.error("Failed to load data from the server.");
      });
  };

  const handleViewDetails = (tour) => {
    navigate(`/tour-details/${tour.bookingId}`);
  };
  const handleStatusChange = (bookingId, newStatus) => {
    // Update the local state immediately
    setTourData((prevData) => {
      const updatedData = prevData.map((tour) =>
        tour.bookingId === bookingId ? { ...tour, status: newStatus } : tour
      );

      // Store updated data in local storage
      localStorage.setItem("tourData", JSON.stringify(updatedData));

      return updatedData;
    });

    // Then, make the API call to update the status on the server
    axios
      .put(`http://localhost:8080/api/booking/update/${bookingId}`, {
        status: newStatus,
      })
      .then((response) => {
        message.success("Status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        message.error("Failed to update status");
        fetchTourData(); // Refetching data to restore original state
      });
  };

  const columns = [
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "On-going", value: "On-going" },
        { text: "Paid Booking", value: "Paid Booking" },
        { text: "Order Prepare", value: "Order Prepare" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status.includes(value),
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 10 }}>{text}</span>{" "}
          {/* Current status displayed */}
          <Select
            value={text} // Use value to reflect the current status
            style={{ width: 150 }}
            onChange={(value) => handleStatusChange(record.bookingId, value)}
          >
            <Option value="On-going">On-going</Option>
            <Option value="Paid Booking">Paid Booking</Option>
            <Option value="Order Prepare">Order Prepare</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="default" onClick={() => handleViewDetails(record)}>
          More
        </Button>
      ),
    },
  ];

  const filteredData = tourData.filter((tour) => {
    if (filteredStatus === "All") return true;
    return tour.status === filteredStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = moment(a[sortBy]);
    const dateB = moment(b[sortBy]);
    return sortOrder === "ascend" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Tour List</h1>
      <Table columns={columns} dataSource={sortedData} pagination={false} />
    </div>
  );
};

export default TourList;
