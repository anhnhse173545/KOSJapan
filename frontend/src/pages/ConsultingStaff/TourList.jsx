import { useState, useEffect } from "react";
import { Table, Button, Badge, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";

const TourList = () => {
  const [tourData, setTourData] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("ascend");
  const [sortBy, setSortBy] = useState("startDate");
  const navigate = useNavigate();

  // Fetch data from the API
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/booking/consulting-staff/AC0004")
      .then((response) => {
        const data = response.data;
        setTourData(
          data.map((item, index) => ({
            key: index + 1,
            bookingId: item.id, // This line is redundant
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
  }, []);

  // Handlers for actions (Check In, Cancel, Mark Completed)
  const handleCheckIn = (key) => {
    axios
      .put(`http://localhost:8080/api/booking/check-in/${key}`)
      .then(() => {
        const updatedTourData = tourData.map((tour) => {
          if (tour.key === key && tour.status === "Not Check In") {
            return { ...tour, status: "Checked In" };
          }
          return tour;
        });

        setTourData(updatedTourData);
        message.success("Status changed to Checked In.");
      })
      .catch((error) => {
        console.error("Error checking in:", error);
        message.error("Failed to check in.");
      });
  };

  const handleCancel = (key) => {
    axios
      .put(`http://localhost:8080/api/booking/cancel/${key}`)
      .then(() => {
        const updatedTourData = tourData.map((tour) => {
          if (tour.key === key && tour.status !== "Checked In") {
            return { ...tour, status: "Cancelled" };
          }
          return tour;
        });

        setTourData(updatedTourData);
        message.success("Status changed to Cancelled.");
      })
      .catch((error) => {
        console.error("Error cancelling:", error);
        message.error("Failed to cancel the tour.");
      });
  };

  const handleMarkCompleted = (key) => {
    axios
      .put(`http://localhost:8080/api/booking/complete/${key}`)
      .then(() => {
        const updatedTourData = tourData.map((tour) => {
          if (tour.key === key && tour.status === "Checked In") {
            return { ...tour, status: "Completed" };
          }
          return tour;
        });

        setTourData(updatedTourData);
        message.success("Tour marked as Completed.");
      })
      .catch((error) => {
        console.error("Error marking as completed:", error);
        message.error("Failed to mark as completed.");
      });
  };

  const handleViewDetails = (tour) => {
    navigate(`/tour-details/${tour.bookingId}`); // Use bookingId for navigation
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
        { text: "Not Check In", value: "Not Check In" },
        { text: "Checked In", value: "Checked In" },
        { text: "Cancelled", value: "Cancelled" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status.includes(value),
      render: (text) => {
        const statusColor =
          text === "Checked In"
            ? "success"
            : text === "Cancelled"
            ? "error"
            : text === "Completed"
            ? "processing"
            : "warning";
        return <Badge status={statusColor} text={text} />;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            type="default"
            onClick={() => handleViewDetails(record)} // Call handleViewDetails
          >
            More
          </Button>
        </>
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
