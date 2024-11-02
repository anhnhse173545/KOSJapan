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

const DeliveryStaffHome = () => {
  const [orderStatusData, setOrderStatusData] = useState(null);
  const [paymentStatusData, setPaymentStatusData] = useState(null);
  const [totalPriceData, setTotalPriceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/fish-order/delivery-staff/AC0003"
        );
        const data = response.data;

        console.log("API Response Data:", data);

        // Process Order Status Data
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

        // Process Payment Status Data
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
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Order Status</h2>
          <div className="h-[300px]">
            {orderStatusData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4bc0c0" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>Loading Order Status...</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
          <div className="h-[300px]">
            {paymentStatusData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>Loading Payment Status...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStaffHome;
