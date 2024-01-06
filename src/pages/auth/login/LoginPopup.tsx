import Header from "../../../components/layout/header/Header";
import metamask from "../../../assets/auth/metamask.svg";
import "./loginPopup.scss";
import cancelIcon from "../../../assets/auth/cancel.svg";
import { Link, useNavigate } from "react-router-dom";

const LoginPopup = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/user");
  };
  return (
    <Header>
      <div className="login">
        <div className="popup">
          <Link to="/">
            <img className="close-btn" src={cancelIcon} alt="" />
          </Link>
          <h3>Select your wallet</h3>
          <button className="btn" onClick={handleLogin}>
            <img src={metamask} alt="" />
            <span>MetaMask</span>
          </button>
        </div>
      </div>
    </Header>
  );
};

export default LoginPopup;
