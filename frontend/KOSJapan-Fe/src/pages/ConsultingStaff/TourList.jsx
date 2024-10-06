import { useState } from "react";
import { Table, Button, Badge, message, Modal } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the jsPDF autoTable plugin

// Initial data for the tours
const initialTourData = [
  {
    key: "1",
    customer: "John Doe",
    startDate: "2024-10-01",
    endDate: "2024-10-05",
    status: "Not Check In",
  },
  {
    key: "2",
    customer: "Jane Smith",
    startDate: "2024-10-03",
    endDate: "2024-10-06",
    status: "Not Check In",
  },
  {
    key: "3",
    customer: "Alice Johnson",
    startDate: "2024-10-04",
    endDate: "2024-10-07",
    status: "Checked In",
  },
  {
    key: "4",
    customer: "Bob Brown",
    startDate: "2024-10-02",
    endDate: "2024-10-08",
    status: "Not Check In",
  },
];

// Sample trip itinerary
const tripPlan = `
Day 1: Tokyo – A Blend of Old and New
  Morning: Tsukiji Market and Toyosu Market
  Midday: Tokyo Tower and Modern Art
  Afternoon: Shibuya Crossing and Shopping
  Evening: Dining in Golden Gai

Day 2: Kyoto – Timeless Traditions
  Morning: Fushimi Inari Shrine
  Midday: Nishiki Market and Lunch
  Afternoon: Traditional Arts and Green Tea Ceremony
  Evening: Traditional Japanese Dinner and Ryokan Experience

Day 3: The Mount Fuji Experience
  Early Morning: Travel to Mount Fuji
  Midday: Boat Ride and Lunch
  Afternoon: Hiking and Nature Exploration
  Evening: Luxury Onsen Ryokan Stay

Day 4: Tokyo Revisited – Cherry Blossoms and Serenity
  Morning: Meguro River Cherry Blossoms
  Midday: Lunch and Quirky Convenience Store Experience
  Afternoon: Cultural Sites and Relaxation
  Evening: Shibuya Sensory Overload

Day 5: Departure from Narita Airport
  Morning: Last Minute Shopping and Sightseeing
  Midday: Reflective Lunch
  Afternoon: Departure Preparations
`;

const TourList = () => {
  const [tourData, setTourData] = useState(initialTourData);
  const [selectedTour, setSelectedTour] = useState(null); // State for the selected tour
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  // Function to handle status change when "Check In" button is clicked
  const handleCheckIn = (key) => {
    const updatedTourData = tourData.map((tour) => {
      if (tour.key === key && tour.status === "Not Check In") {
        return { ...tour, status: "Checked In" };
      }
      return tour;
    });

    setTourData(updatedTourData);
    message.success("Status changed to Checked In.");
  };

  // Function to handle viewing tour details
  const handleViewDetails = (tour) => {
    setSelectedTour(tour);
    setIsModalVisible(true); // Open the modal
  };

  // Function to handle exporting details to PDF
  const handleExportToPDF = () => {
    if (!selectedTour) return;

    const doc = new jsPDF();
    doc.text("Tour Details", 20, 10);

    // Add auto table for the customer's tour details
    doc.autoTable({
      head: [["Customer", "Start Date", "End Date", "Status"]],
      body: [
        [
          selectedTour.customer,
          selectedTour.startDate,
          selectedTour.endDate,
          selectedTour.status,
        ],
      ],
    });

    doc.text("Trip Plan", 20, 50);
    doc.autoTable({
      body: tripPlan.split("\n").map((line) => [line.trim()]), // Splitting the trip plan for multi-line display
    });

    // Save the PDF
    doc.save(`${selectedTour.customer}_tour_details.pdf`);
  };

  // Define the columns for the table
  const columns = [
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const statusColor = text === "Checked In" ? "success" : "warning";
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
            disabled={record.status === "Checked In"} // Disable if already checked in
            onClick={() => handleCheckIn(record.key)}
            style={{ marginRight: 8 }}
          >
            {record.status === "Checked In" ? "Checked In" : "Check In"}
          </Button>
          <Button type="default" onClick={() => handleViewDetails(record)}>
            More
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Tour List</h1>
      <Table
        columns={columns}
        dataSource={tourData}
        pagination={false} // Disable pagination for simplicity
      />

      {/* Modal for displaying trip details */}
      {selectedTour && (
        <Modal
          title="Trip Details"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="export" type="primary" onClick={handleExportToPDF}>
              Export to PDF
            </Button>,
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          <p>
            <strong>Customer:</strong> {selectedTour.customer}
          </p>
          <p>
            <strong>Start Date:</strong> {selectedTour.startDate}
          </p>
          <p>
            <strong>End Date:</strong> {selectedTour.endDate}
          </p>
          <p>
            <strong>Status:</strong> {selectedTour.status}
          </p>
          <h3>Trip Plan</h3>
          <pre>{tripPlan}</pre>
        </Modal>
      )}
    </div>
  );
};

export default TourList;
