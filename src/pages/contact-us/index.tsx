import { Button, Form, Input, Checkbox, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthenLayout from "../../components/auth-layout";

const { TextArea } = Input;
const { Option } = Select;

function CombinedKoiRequestForm() {
    const navigate = useNavigate();

    const handleFormSubmit = async (values: any) => {
        try {
            // Send form data to API
            await api.post("KoiRequest", values);
            toast.success("Your request has been submitted successfully!");
            // Navigate to success page or another route
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
            <h2>Request a Koi </h2>
            <p>Instructions:</p>
            <ul>
                <li>Please fill out this short form to let us know to reserve a seat for you (space is limited).</li>
                <li>Use this form to also request your dream Koi. We will find it in Japan and send you photos and pricing.</li>
            </ul>
            <Form
                labelCol={{ span: 24 }}
                onFinish={handleFormSubmit}
                layout="vertical"
            >
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

                {/* Submit Button */}
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
