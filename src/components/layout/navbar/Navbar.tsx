import "./navbar.scss";
import logo from "../../../assets/navbar/logo.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="" />
      </Link>
      <h3>{t("header.QuickAccounting")}</h3>
    </nav>
  );
};

export default Navbar;
