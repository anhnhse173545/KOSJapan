
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
            <div style={{ marginBottom: 24 }}>
                <span style={{ marginRight: 16 }}>
                    <Switch
                        checked={showSeatForm}
                        onChange={(checked) => setShowSeatForm(checked)}
                        style={{ marginRight: 8 }}
                    />
                    Show Reserve Seat Form
                </span>
                <span>
                    <Switch
                        checked={showKoiForm}
                        onChange={(checked) => setShowKoiForm(checked)}
                        style={{ marginRight: 8 }}
                    />
                    Show Request Koi Form
                </span>
            </div>
            {
                <Form labelCol={{ span: 24 }} onFinish={handleFormSubmit} layout="vertical">
                       {/* Full Name */}
                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: "Please enter your full name" }]}
                >
                    <Input placeholder="First and Last Name" />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Please enter your email" }]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: "Please enter your phone number" }]}
                >
                    <Input placeholder="Enter your phone number" />
                </Form.Item>

                {/* Dealer/Wholesaler Question */}
                <Form.Item
                    label="Are you a dealer, wholesaler, or in the pond business?"
                    name="businessType"
                    rules={[{ required: true, message: "Please select yes or no" }]}
                >
                    <Select placeholder="Choose Yes or No">
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                    </Select>
                </Form.Item>

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
                </Form>
            }
            {/* Seat Reservation Form */}
            {showSeatForm && (
                <Form labelCol={{ span: 24 }} onFinish={handleFormSubmit} layout="vertical">
                    <h3>VIsit koi farm</h3>
                    {/* Number of People */}
                    <Form.Item
                        label="How many people?"
                        name="numberOfPeople"
                        rules={[{ required: true, message: "Please enter the number of people" }]}
                    >
                        <InputNumber min={1} placeholder="Number of People" />
                    </Form.Item>

                    {/* Departure Date */}
                    <Form.Item
                        label="Departure Date"
                        name="departureDate"
                        rules={[{ required: true, message: "Please select your departure date" }]}
                    >
                        <DatePicker style={{ width: "100%" }} placeholder="Select departure date" />
                    </Form.Item>

                    {/* Arrival Date */}
                    <Form.Item
                        label="Arrival back date"
                        name="arrivalDate"
                        rules={[{ required: true, message: "Please select your arrival date" }]}
                    >
                        <DatePicker style={{ width: "100%" }} placeholder="Select arrival date" />
                    </Form.Item>

                    {/* Address */}
                    <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter your address" }]}>
                        <Input.Group>
                            <Form.Item name={['address', 'homeAddress']} noStyle rules={[{ required: true, message: 'Home Address is required' }]}>
                                <Input placeholder="Home Address" style={{ marginBottom: '8px' }} />
                            </Form.Item>
                            <br /> 
                            <Form.Item name={['address', 'placeToGo']} noStyle>
                                <Input placeholder="Place to go (if you have more than 2,separated by , )" style={{ marginBottom: '8px' }} />
                            </Form.Item>
                           
                           
                     
                          
                        </Input.Group>
                    </Form.Item>

                   
                </Form>
            )}

            {/* Koi Request Form */}
            {showKoiForm && (
                <Form labelCol={{ span: 24 }} onFinish={handleFormSubmit} layout="vertical">
                    <h3>Request a Koi</h3>

                                    {/* Koi Size Range */}
                <Form.Item
                    label="Koi Size Range"
                    name="koiSizeRange"
                    rules={[{ required: true, message: "Please select a size range" }]}
                >
                    <Checkbox.Group>
                        <Checkbox value="20 inches+">20 inches +</Checkbox>
                        <Checkbox value="16-20 inches">16 - 20 inches</Checkbox>
                        <Checkbox value="12-16 inches">12 - 16 inches</Checkbox>
                        <Checkbox value="8-12 inches">8 - 12 inches</Checkbox>
                        <Checkbox value="other">Other</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {/* Price Range */}
                <Form.Item
                    label="Price Range"
                    name="priceRange"
                    rules={[{ required: true, message: "Please select a price range" }]}
                >
                    <Checkbox.Group>
                        <Checkbox value="$5000+">$5000+</Checkbox>
                        <Checkbox value="$3000-$5000">$3000 - $5000</Checkbox>
                        <Checkbox value="$1000-$2000">$1000 - $2000</Checkbox>
                        <Checkbox value="upTo$1000">Up to $1000</Checkbox>
                        <Checkbox value="other">Other</Checkbox>
                    </Checkbox.Group>
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
            )}
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
