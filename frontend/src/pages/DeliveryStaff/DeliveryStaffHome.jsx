'use client'

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
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

export default function DeliveryStaffHome() {
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);
  const [totalPriceData, setTotalPriceData] = useState([]);
  const [priceByFarmData, setPriceByFarmData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'Delivery Staff') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/fish-order/delivery-staff/${user.id}`
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

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!user || user.role !== 'Delivery Staff') {
    return (
      <Alert>
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>You must be logged in as a delivery staff member to view this dashboard.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Delivery Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Order Status Distribution</h3>
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

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Payment Status Distribution</h3>
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
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Total Price Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={totalPriceData}>
              <XAxis dataKey="bookingId" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Total Price by Farm</h3>
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
}