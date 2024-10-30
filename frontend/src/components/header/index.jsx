import { useNavigate } from "react-router-dom";
import "./index.scss";
import { UserOutlined } from "@ant-design/icons";
function Header() {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="header__left">
        <img
          onClick={() => navigate("/")}
          src="https://png.pngtree.com/png-vector/20220719/ourmid/pngtree-vector-illustration-of-a-koi-fish-yin-yang-concept-design-vector-png-image_37993206.png"
          alt="logo"
          className="header__logo"
          width={100}
        />
        <ul className="header__navigation">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/payment")}>My Booking</li>
          <li onClick={() => navigate("/contact")}>Request</li>
          <li onClick={() => navigate("/koifarmpage")}>Koi Farm</li>
          <li onClick={() => navigate("/koi-trip")}>Koi Trip</li>
          <li onClick={() => navigate("/aboutus")}>About Us</li>
        </ul>
      </div>
      {/* space */}
      <div className="header__right">
        <div className="header__cart" onClick={() => navigate("/mykoi")}>
          <span className="number"></span>
        </div>
        <div className="header__account">
          <UserOutlined
            size={50}
            className="icon"
            onClick={() => navigate("/login")}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
