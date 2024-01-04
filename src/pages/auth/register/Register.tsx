import logo from "../../../assets/auth/logo.jpg";
import Header from "../../../components/layout/header/Header";
import "./register.scss";

const Register = () => {
  return (
    <Header>
      <div className="register">
        <img src={logo} alt="" />
        <h3 className="register-title">
          Web3 accounting software for crypto organizations.
        </h3>
        <p className="register-description">
          Quick Accounting has the ability to tracking the transactions of
          crypto assets for organizations, maintain balance sheet of
          organizations, and generate financial reports. Everything in QA is
          trackable, and transparent.
        </p>
        <button className="connect-btn">Connect Wallet</button>
      </div>
    </Header>
  );
};

export default Register;
