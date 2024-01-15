import Header from "../../../components/layout/header/Header";
import metamask from "../../../assets/auth/metamask.svg";
import "./loginPopup.scss";
import cancelIcon from "../../../assets/auth/cancel.svg";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  useConnect,
  useAccount,
  useSignMessage,
  useChainId,
  useDisconnect,
  ConnectorAlreadyConnectedError,
} from "wagmi";
import { useLoading } from "../../../store/useLoading";
import { useAuthStore } from "../../../store/useAuthStore";

const LoginPopup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { connectors, isLoading: connectLoading, connectAsync } = useConnect();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync, isLoading: signLoading } = useSignMessage();

  const [clickConnectFlag, setClickConnectFlag] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  let loading = false;

  const formValue = {
    domain: "",
    message: "",
    signature: "",
    wallet: "",
  };
  const { isLoading } = useLoading();
  const { loginAsync } = useAuthStore();

  useEffect(() => {
    if (connectLoading || signLoading || loginLoading) {
      if (!loading) {
        // TODO show loading
      }
    } else if (loading) {
      // TODO hide loading
    }
  }, [connectLoading, signLoading, loginLoading, loading]);

  useEffect(() => {
    if (isConnected && address && clickConnectFlag) {
      // TODO sign
      // TODO login
      loginAsync(formValue, navigate);
    }
  }, [isConnected, address, clickConnectFlag]);

  const onClickConnect = async () => {
    const connector = connectors[0];
    if (!connector.ready) {
      alert("Please install MetaMask");
      return;
    }
    try {
      // connect
      await connectAsync({ connector });
      setClickConnectFlag(true);
    } catch (error) {
      if (error instanceof ConnectorAlreadyConnectedError) {
        if (isConnected && address) {
          setClickConnectFlag(true);
        }
      }
    }
  };
  return (
    <Header>
      <div className="login">
        <div className="popup">
          <Link to="/">
            <img className="close-btn" src={cancelIcon} alt="" />
          </Link>
          <h3>{t("login.LoginTitle")}</h3>
          <button className="btn" onClick={onClickConnect}>
            <img src={metamask} alt="" />
            <span>{t("login.MetaMask")}</span>
          </button>
        </div>
      </div>
    </Header>
  );
};

export default LoginPopup;
