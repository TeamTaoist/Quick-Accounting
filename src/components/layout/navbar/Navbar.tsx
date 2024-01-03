import "./navbar.scss";
import logo from "../../../assets/navbar/logo.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="" />
      </Link>
      <h3>Quick Accounting</h3>
    </nav>
  );
};

export default Navbar;
