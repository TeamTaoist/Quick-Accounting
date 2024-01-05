import { Link } from "react-router-dom";
import logo from "../../assets/auth/logo.jpg";
import "./home.scss";
import Header from "../../components/layout/header/Header";

const Home = () => {
  return (
    <Header>
      <div className="home">
        <img src={logo} alt="" />
        <h3 className="home-title">
          Web3 accounting software for crypto organizations.
        </h3>
        <p className="home-description">
          Quick Accounting has the ability to tracking the transactions of
          crypto assets for organizations, maintain balance sheet of
          organizations, and generate financial reports. Everything in QA is
          trackable, and transparent.
        </p>
        <Link to="/login" className="connect-btn">
          Connect Wallet
        </Link>
      </div>
    </Header>
  );
};

export default Home;
