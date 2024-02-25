import Header from "../../../components/layout/header/Header";
import logo from "../../../assets/auth/logo.jpg";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useLoading } from "../../../store/useLoading";
import { useAuthStore } from "../../../store/useAuthStore";
import Loading from "../../../utils/Loading";
import { useWorkspace } from "../../../store/useWorkspace";
import LoginContent from "./LoginContent";

const LoginPopup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const [loginVidible, setLoginVisible] = useState(false);

  const { isLoading, setLoading } = useLoading();
  const { user } = useAuthStore();

  console.log("loading", isLoading);

  const { getUserWorkspace } = useWorkspace();

  useEffect(() => {
    const handleVerify = async () => {
      try {
        const data = await getUserWorkspace();
        if (data?.code === 200) {
          const firstWorkspaceId = data.data.rows[0]?.ID;
          if (firstWorkspaceId) {
            navigate(`/workspace/${firstWorkspaceId}/assets`);
          } else if (user.token) {
            navigate("/user");
          }
        }
      } catch (error) {}
    };
    if (user.token && address && isConnected && user.wallet === address) {
      handleVerify();
    }
  }, [user]);

  const handleLoginCallback = () => {
    navigate("/user");
  };

  return (
    <>
      {isLoading && <Loading />}
      <Header>
        {loginVidible ? (
          <LoginContent
            handleClose={() => setLoginVisible(false)}
            loginCallback={handleLoginCallback}
          />
        ) : (
          <div className="home-container">
            <div className="home">
              <img src={logo} alt="" />
              <h3 className="home-title">{t("home.HomeTitle")}</h3>
              <p className="home-description">{t("home.HomeDescription")}</p>
              <span
                className="connect-btn"
                onClick={() => setLoginVisible(true)}
              >
                {t("home.ConnectBtn")}
              </span>
            </div>
          </div>
        )}
      </Header>
    </>
  );
};

export default LoginPopup;
