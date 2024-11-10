"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../styles/Delivery/DeliveryStaffHome.css";
const DeliveryStaffHome = () => {
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);
  const [totalPriceData, setTotalPriceData] = useState([]);
  const [priceByFarmData, setPriceByFarmData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/fish-order/delivery-staff/AC0003"
        );
        const data = response.data;

        console.log("API Response Data:", data);

        // Order Status Data
        const orderStatusCount = data.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});
        setOrderStatusData(
          Object.entries(orderStatusCount).map(([status, count]) => ({
            status,
            count,
          }))
        );

        // Payment Status Data
        const paymentStatusCount = data.reduce((acc, order) => {
          acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
          return acc;
        }, {});
        setPaymentStatusData(
          Object.entries(paymentStatusCount).map(([status, count]) => ({
            status,
            count,
          }))
        );

        // Total Price Data Over Time
        setTotalPriceData(
          data.map((order) => ({
            bookingId: order.bookingId,
            total: order.total,
          }))
        );

        // Total Price by Farm Data
        const farmPriceData = data.reduce((acc, order) => {
          acc[order.farmId] = (acc[order.farmId] || 0) + order.total;
          return acc;
        }, {});
        setPriceByFarmData(
          Object.entries(farmPriceData).map(([farmId, total]) => ({
            farmId,
            total,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="chart-row">
        <div className="chart-container">
          <h3>Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusData}>
              <XAxis dataKey="status" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Payment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#8884d8", "#8dd1e1", "#82ca9d"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-row">
        <div className="chart-container">
          <h3>Total Price Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={totalPriceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Another Chart Title</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceByFarmData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="farmId" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStaffHome;
