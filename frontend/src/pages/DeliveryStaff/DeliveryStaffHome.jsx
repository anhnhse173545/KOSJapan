import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import { Bar, Pie, Line } from "react-chartjs-2";
import axios from "axios";

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
        console.log("Fetched data:", data); // To check the data structure

        setOrderStatusData({
          labels: data.orderStatus?.map((item) => item.status) || [],
          datasets: [
            {
              label: "Orders by Status",
              data: data.orderStatus?.map((item) => item.count) || [],
              backgroundColor: "rgba(75,192,192,0.6)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        });

        setPaymentStatusData({
          labels: data.paymentStatus?.map((item) => item.status) || [],
          datasets: [
            {
              label: "Payments by Status",
              data: data.paymentStatus?.map((item) => item.count) || [],
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
            },
          ],
        });

        setTotalPriceData({
          labels: data.totalPrice?.map((item) => item.date) || [],
          datasets: [
            {
              label: "Total Price Over Time",
              data: data.totalPrice?.map((item) => item.amount) || [],
              fill: false,
              backgroundColor: "#4bc0c0",
              borderColor: "#4bc0c0",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Card title="Order Status">
            {orderStatusData ? (
              <Bar
                data={orderStatusData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            ) : (
              <p>Loading Order Status...</p>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Card title="Payment Status">
            {paymentStatusData ? (
              <Pie
                data={paymentStatusData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            ) : (
              <p>Loading Payment Status...</p>
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card title="Total Price Over Time">
            {totalPriceData ? (
              <Line
                data={totalPriceData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            ) : (
              <p>Loading Total Price Data...</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DeliveryStaffHome;
