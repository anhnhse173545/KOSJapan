import { Button, Form, Input, DatePicker } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthenLayout from "../../components/auth-layout";
import './request.css';

const { TextArea } = Input;

const generateRandomBookingId = () => {
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `TR${randomNum}`;
};

const CombinedKoiRequestForm = () => {
  const [form] = Form.useForm(); 
  const navigate = useNavigate();

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
        form.setFieldsValue({
          name: cusData.name,
          phone: cusData.phone || '',
          email: cusData.email,
        });
      } else {
        toast.error("Không thể tải dữ liệu booking.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu.");
    }
  };

  useEffect(() => {
    fetchBookingInfo();
  }, []);

  const handleFormSubmit = async (values) => {
    try {
      const id = generateRandomBookingId();
  
      // Gộp các thông tin thành 1 chuỗi mô tả duy nhất
      const combinedDescription = `
        Trip Details: ${values.description || 'N/A'}
        Start Date: ${values.startDate ? values.startDate.format("YYYY-MM-DD") : 'N/A'}
        End Date: ${values.endDate ? values.endDate.format("YYYY-MM-DD") : 'N/A'}
      `;
  
      const data = {
        id,
        name: form.getFieldValue("name") || '',
        phone: form.getFieldValue("phone") || '',
        email: form.getFieldValue("email") || '',
        description: combinedDescription,
        departureAirport: values.departureAirport || '',
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
        toast.success(errorData.error || "Yêu cầu của bạn đã được gửi thành công.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu.");
    }
  };
  

  return (
    <AuthenLayout>
      <h2>REQUEST</h2>

      <Form
        form={form}
        labelCol={{ span: 24 }}
        onFinish={handleFormSubmit}
        layout="vertical"
      >
        <Form.Item name="name" hidden>
          <Input />
        </Form.Item>
        
        <Form.Item 
          name="phone" 
          hidden
          rules={[
            { pattern: /^\d{10,11}$/, message: "Please enter a valid phone number (10-11 digits)" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          name="email" 
          hidden
          rules={[
            { type: 'email', message: "Please enter a valid email address" },
          ]}
        >
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
          label="Desired Trip Start Date"
          name="startDate"
          rules={[
            { required: true, message: "Please select the start date of your trip" },
          ]}
        >
          <DatePicker placeholder="Select the start date" />
        </Form.Item>

        <Form.Item
          label="Desired Trip End Date"
          name="endDate"
          rules={[
            { required: true, message: "Please select the end date of your trip" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value.isAfter(getFieldValue("startDate"))) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("End date must be after start date"));
              },
            }),
          ]}
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
