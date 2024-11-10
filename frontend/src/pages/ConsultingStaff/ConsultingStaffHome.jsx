import { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import { useParams } from "react-router-dom";
import "../../styles/Consulting/ConsultingHome.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
);

const ConsultingStaffHome = () => {
  const [userName, setUserName] = useState("Loading...");
  const [fishOrders, setFishOrders] = useState([]);
  const { consultingStaffId } = useParams();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/accounts/${consultingStaffId}/detail`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setUserName("Error fetching name");
      }
    };

    const fetchFishOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/fish-order/consulting-staff/${consultingStaffId}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setFishOrders(data);
      } catch (error) {
        console.error("Failed to fetch fish orders:", error);
      }
    };

    if (consultingStaffId) {
      fetchUserName();
      fetchFishOrders();
    }
  }, [consultingStaffId]);

  // Preparing data for Total Orders by Customer (Bar Chart)
  const customerOrderData = fishOrders.reduce((acc, order) => {
    const customerName = order.customer.name;
    acc[customerName] = (acc[customerName] || 0) + 1;
    return acc;
  }, {});

  const customerOrderChartData = {
    labels: Object.keys(customerOrderData),
    datasets: [
      {
        label: "Number of Orders",
        data: Object.values(customerOrderData),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Preparing data for Total Payment by Farm (Pie Chart)
  const farmPaymentData = fishOrders.reduce((acc, order) => {
    const farmId = order.farmId;
    acc[farmId] = (acc[farmId] || 0) + order.total;
    return acc;
  }, {});

  const farmPaymentChartData = {
    labels: Object.keys(farmPaymentData),
    datasets: [
      {
        data: Object.values(farmPaymentData),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Preparing data for Order Payment Status Distribution (Pie Chart)
  const paymentStatusData = fishOrders.reduce((acc, order) => {
    const status = order.paymentStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const paymentStatusChartData = {
    labels: Object.keys(paymentStatusData),
    datasets: [
      {
        data: Object.values(paymentStatusData),
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  // Preparing data for Total Price Over Time (Line Chart)
  const orderTotalOverTimeData = {
    labels: fishOrders.map((order) => order.id), // Using `id` as the x-axis label
    datasets: [
      {
        label: "Total Price",
        data: fishOrders.map((order) => order.total),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1>Welcome, {userName}!</h1>
      <p>We wish you a good working day!</p>

      {/* Row 1: Total Orders by Customer (Bar Chart) & Total Payment by Farm (Pie Chart) */}
      <div className="chart-row">
        <div className="chart-container">
          <h2 className="mt-8 text-xl font-semibold">
            Total Orders by Customer
          </h2>
          <Bar
            data={customerOrderChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Total Orders by Customer" },
              },
            }}
          />
        </div>

        <div className="pie-chart-container">
          <h2 className="mt-8 text-xl font-semibold">Total Payment by Farm</h2>
          <Pie
            data={farmPaymentChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Total Payment by Farm" },
              },
            }}
          />
        </div>
      </div>

      {/* Row 2: Payment Status Distribution & Total Price Over Time */}
      <div className="chart-row">
        <div className="pie-chart-container">
          <h2 className="mt-8 text-xl font-semibold">
            Order Payment Status Distribution
          </h2>
          <Pie
            data={paymentStatusChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Payment Status Distribution" },
              },
            }}
          />
        </div>

        <div className="chart-container">
          <h2 className="mt-8 text-xl font-semibold">Total Price Over Time</h2>
          <Line
            data={orderTotalOverTimeData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Total Price Over Time" },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Order ID",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Total Price ($)",
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsultingStaffHome;
