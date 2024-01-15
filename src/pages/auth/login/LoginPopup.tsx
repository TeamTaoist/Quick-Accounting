import Header from "../../../components/layout/header/Header";
import metamask from "../../../assets/auth/metamask.svg";
import "./loginPopup.scss";
import cancelIcon from "../../../assets/auth/cancel.svg";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/useAuthStore";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";

export interface LoginForm {
  domain: string;
  message: string;
  signature: string;
  wallet: string;
}

const LoginPopup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formValue = {
    domain: "",
    message: "",
    signature: "",
    wallet: "",
  };
  const { isLoading } = useLoading();
  const { loginAsync } = useAuthStore();

  const handleLogin = async () => {
    loginAsync(formValue, navigate);
  };
  return (
    <Header>
      {!isLoading && <Loading />}
      <div className="login">
        <div className="popup">
          <Link to="/">
            <img className="close-btn" src={cancelIcon} alt="" />
          </Link>
          <h3>{t("login.LoginTitle")}</h3>
          <button className="btn" onClick={handleLogin}>
            <img src={metamask} alt="" />
            <span>{t("login.MetaMask")}</span>
          </button>
        </div>
      </div>
    </Header>
  );
};

export default LoginPopup;
