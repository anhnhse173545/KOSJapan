
import { Button, Form, Input, Checkbox, Upload, Select, DatePicker, InputNumber, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthenLayout from "../../components/auth-layout";
import { useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

function CombinedKoiRequestForm() {
    const [showSeatForm, setShowSeatForm] = useState<boolean>(true); // State to handle seat form visibility
    const [showKoiForm, setShowKoiForm] = useState<boolean>(true); // State to handle koi form visibility
    const navigate = useNavigate();

    // Form submission handler
    const handleFormSubmit = async (values: any) => {
        try {
            // Submit to different endpoints based on form type
            await api.post(showSeatForm ? "SeatRequest" : "KoiRequest", values);
            toast.success("Your request has been submitted successfully!");
            navigate("/success");
        } catch (err: any) {
            if (err.response && err.response.data) {
                toast.error(err.response.data);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    };

    return (
        <AuthenLayout>
            <h2>Request A Trip To Koi Farm</h2>
            
            {/* Checkbox to toggle form visibility */}
            {
                <Form labelCol={{ span: 24 }} onFinish={handleFormSubmit} layout="vertical">
                       {/* Full Name */}
                


             

                
                {/* Desired Koi Variety and Description */}
                <Form.Item
                    label="Desired Koi Variety and Description"
                    name="koiDescription"
                    rules={[
                        { required: true, message: "Please provide a description" },
                    ]}
                >
                    <TextArea placeholder="Describe the Koi you're looking for" rows={4} />
                </Form.Item>

                 {/* Desired Trip you wanna go */}
                 <Form.Item 
                    label="Desired Trip and Description"
                    name="TripDescription"
                    rules={[
                        { required: true, message: "Please provide a description" },
                    ]}
                >
                    <TextArea placeholder="Describe the Trip you're looking for" rows={4} />
                </Form.Item>
                    {/* Desired your address */}
                 <Form.Item
                    label="Your House Address"
                    name="Address"
                    rules={[
                        { required: true, message: "Please provide a address" },
                    ]}
                >
                    <TextArea placeholder="Describe the Address" rows={4} />
                </Form.Item>

                 {/* Desired Trip Start */}
<Form.Item
    label="Desired Trip Start"
    name="TripStartDate"
    rules={[
        { required: true, message: "Please select the start date of your trip" },
    ]}
>
    <DatePicker placeholder="Select the start date" />
</Form.Item>

{/* Desired Trip End */}
<Form.Item
    label="Desired Trip End"
    name="TripEndDate"
    rules={[
        { required: true, message: "Please select the end date of your trip" },
    ]}
>
    <DatePicker placeholder="Select the end date" />
</Form.Item>

  {/* Image Upload */}
  <Form.Item label="You can send us images here:">
                    <Upload 
                        name="images" 
                        listType="picture"
                        action="your-api-endpoint" // Change this to your actual upload API endpoint
                    >
                        <Button icon={<UploadOutlined />}>Select files</Button>
                    </Upload>
                </Form.Item> 

           
                </Form>
            }
           
            

               

              
            
           
             {/* Submit Button */}
             <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Request
                        </Button>
                    </Form.Item>
        </AuthenLayout>
    );
}

export default CombinedKoiRequestForm;
