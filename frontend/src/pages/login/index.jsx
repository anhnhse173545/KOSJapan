import { Button, Form, Input } from "antd";
import api from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthenLayout from "../../components/auth-layout";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      // Send login request to get tokens
      const { data } = await api.post("http://localhost:8080/api/auth/login", {
        phone: values.phonenumber,
        password: values.password,
      });

      // Store tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Fetch user data using access token
      const userResponse = await api.get("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      const userRole = userResponse.data.role?.trim();
      console.log("User Role:", userRole);

      const roleLower = userRole?.toLowerCase();
      console.log("Navigating based on role:", roleLower);

      // Navigate based on role
      switch (roleLower) {
        case "consulting staff":
          navigate("/cs-dashboard");
          break;
        case "customer":
          navigate("/");
          break;
        case "manager":
          navigate("/manager-dashboard");
          break;
        case "sale staff":
          navigate("/ss-dashboard");
          break;
        case "delivery staff":
          navigate("/ds-dashboard");
          break;
        default:
          console.log("Unknown role:", userRole);
          navigate("/"); // Fallback
      }

      // Dispatch user data after navigation
      dispatch(login(userResponse.data));
      toast.success("Login successful");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        toast.error(err.response.data.message || "Login failed");
      } else {
        console.error("Unexpected error:", err);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleRegister = () => {
    // Navigate to the registration page
    navigate("/register");
  };

  return (
    <AuthenLayout>
      <Form labelCol={{ span: 24 }} onFinish={handleLogin}>
        <h1>LOGIN</h1>
        <Form.Item
          label="Phone number"
          name="phonenumber"
          rules={[
            {
              required: true,
              message: "Please enter your phone number",
            },
          ]}
        >
          <Input placeholder="Enter your phone" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "10px" }}
          >
            Login
          </Button>
          <Button type="default" onClick={handleRegister}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </AuthenLayout>
  );
}

export default Login;
