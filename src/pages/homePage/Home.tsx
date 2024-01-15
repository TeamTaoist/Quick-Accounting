import { Link } from "react-router-dom";
import logo from "../../assets/auth/logo.jpg";
import "./home.scss";
import Header from "../../components/layout/header/Header";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <Header>
      <div className="home-container">
        <div className="home">
          <img src={logo} alt="" />
          <h3 className="home-title">{t("home.HomeTitle")}</h3>
          <p className="home-description">{t("home.HomeDescription")}</p>
          <Link to="/login" className="connect-btn">
            {t("home.ConnectBtn")}
          </Link>
        </div>
      </div>
    </Header>
  );
};

export default Home;
