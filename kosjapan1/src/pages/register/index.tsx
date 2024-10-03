
import { toast } from "react-toastify";
import AuthenLayout from "../../components/auth-layout"
import { Button, Form, Input } from "antd";
import api from "../../config/api";

function Register() {
    
    const handleRegister = (values: any) => {
        try {
            api.post("register",values);
        } catch (err: any) {
            toast.error(err.response.data);
        }
    };
  return (
  <AuthenLayout>
    <Form   
      name="userForm"
      layout="vertical"
      onFinish={handleRegister}
      initialValues={{
        role: 'ADMIN', // Default value for role
      }}
    >
      {/* UserName */}
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please enter your username' }]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>

      {/* Phone */}
      <Form.Item
        name="phone"
        label="Phone"
        rules={[{ required: true, message: 'Please enter your phone number' }]}
      >
        <Input placeholder="Enter phone number" />
      </Form.Item>

      {/* Email */}
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      {/* Password */}
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      {/* Role */}
      {/**
       * <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Please select a role' }]}
      >
        <Select placeholder="Select role">
          <Select.Option value="ADMIN">Admin</Select.Option>
          <Select.Option value="USER">User</Select.Option>
        </Select>
      </Form.Item>
       */}
      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </AuthenLayout>
  );
}

export default Register;