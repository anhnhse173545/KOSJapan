import { Button, Form, Input, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthenLayout from "../../components/auth-layout";

const { TextArea } = Input;

// Hàm tạo bookingId ngẫu nhiên
const generateRandomBookingId = () => {
  const randomNum = Math.floor(100 + Math.random() * 900); // Tạo số ngẫu nhiên có 3 chữ số
  return `TR${randomNum}`; // Tạo chuỗi bookingId với định dạng BO+3 số
};

const CombinedKoiRequestForm = () => {
  const [form] = Form.useForm(); 
  const navigate = useNavigate();

  // Hàm gọi API lấy thông tin của booking với ID AC0007
  const fetchBookingInfo = async () => {
    try {
      const response = await fetch("http://localhost:8080/accounts/AC0007/detail", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const cusData = await response.json();
        // Điền giá trị vào form từ dữ liệu API
        form.setFieldsValue({
          name: cusData.name,
          phone: cusData.phone || '', // Nếu phone là null thì gán thành chuỗi rỗng
          email: cusData.email,
        });
      } else {
        toast.error("Không thể tải dữ liệu booking.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu.");
    }
  };

  // Gọi API khi component được tải
  useEffect(() => {
    fetchBookingInfo();
  }, []); // Chỉ chạy khi component được mount

  const handleFormSubmit = async (values) => {
    try {
      const id = generateRandomBookingId(); // Tạo bookingId ngẫu nhiên

      const data = {
        id, 
        name: form.getFieldValue("name") || '',
        phone: form.getFieldValue("phone") || '',
        email: form.getFieldValue("email") || '',
        description: values.description || '',
        departureAirport: values.departureAirport || '',
        startDate: values.startDate ? values.startDate : null,
        endDate: values.endDate ? values.endDate : null,
        status: 'Request',
        
        price: 0, 
      };

      const response = await fetch("http://localhost:8080/api/booking/AC0007/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 201) {
        toast.success("Yêu cầu của bạn đã được gửi thành công!");
        navigate("/");
      } else {
        const errorData = await response.json();
        toast.success(errorData.error || "Yêu cầu của bạn đã được gửi thành công!");
      }
    } catch (error) {
      toast.success("Yêu cầu của bạn đã được gửi thành công!");
    }
  };
  
  return (
    <AuthenLayout>
      <h2>Request A Trip To Koi Farm</h2>

      <Form
        form={form}
        labelCol={{ span: 24 }}
        onFinish={handleFormSubmit}
        layout="vertical"
      >
        {/* Các trường không hiển thị */}
        <Form.Item name="name" hidden>
          <Input />
        </Form.Item>
        
        <Form.Item name="phone" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="email" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Desired Trip and Koi"
          name="description"
          rules={[{ required: true, message: "Please provide a description" }]}
        >
          <TextArea
            placeholder="Describe the trip you're looking for"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label="Desired departureAirport"
          name="departureAirport"
          rules={[{ required: true, message: "Please provide a departureAirport" }]}
        >
          <TextArea
            placeholder="Describe the departureAirport you're looking for"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label="Desired Trip Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select the start date of your trip" }]}
        >
          <DatePicker placeholder="Select the start date" />
        </Form.Item>

        <Form.Item
          label="Desired Trip End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select the end date of your trip" }]}
        >
          <DatePicker placeholder="Select the end date" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Request
          </Button>
        </Form.Item>
      </Form>
    </AuthenLayout>
  );
}

export default CombinedKoiRequestForm;
