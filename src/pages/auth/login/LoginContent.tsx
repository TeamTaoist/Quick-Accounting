import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useConnect,
  useAccount,
  useSignMessage,
  useChainId,
  ConnectorAlreadyConnectedError,
} from "wagmi";
import { createSiweMessage } from "../../../utils";
import { useAuthStore } from "../../../store/useAuthStore";
import metamask from "../../../assets/auth/metamask.svg";
import cancelIcon from "../../../assets/auth/cancel.svg";
import arrowRight from "../../../assets/auth/arrow-right.svg";
import { toast } from "react-toastify";

interface IProps {
  handleClose: () => void;
  loginCallback: () => void;
}

export default function LoginContent({ handleClose, loginCallback }: IProps) {
  const { t } = useTranslation();

  const { connectors, connectAsync } = useConnect();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const [clickConnectFlag, setClickConnectFlag] = useState(false);

  const { loginAsync, refreshNounce } = useAuthStore();

  useEffect(() => {
    if (isConnected && address && clickConnectFlag) {
      const signAndLogin = async () => {
        // get nonce
        let nonce: string = "";
        try {
          nonce = await refreshNounce(address);
        } catch (error) {
          setClickConnectFlag(false);
          return;
        }
        // sign message
        try {
          const msg = createSiweMessage(
            address,
            chainId,
            nonce,
            "Welcom Quick Accounting"
          );
          const signResult = await signMessageAsync({ message: msg });
          await loginAsync(
            {
              domain: window.location.origin,
              message: msg,
              signature: signResult,
              wallet: address,
            },
            loginCallback
          );
        } catch (error) {
          setClickConnectFlag(false);
        }
      };
      signAndLogin();
    }
  }, [isConnected, address, clickConnectFlag]);

  const onClickConnect = async () => {
    const connector = connectors[0];
    if (!connector) {
      toast.error("Please install MetaMask");
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
    <div className="login">
      <div className="popup">
        <div className="login-header">
          <h3>{t("login.LoginTitle")}</h3>
          <span onClick={handleClose}>
            <img className="close-btn" src={cancelIcon} alt="" />
          </span>
        </div>
        <div className="auth-provider">
          <div className="meta-mask">
            <button className="btn" onClick={onClickConnect}>
              <img src={metamask} alt="" />
              <span>{t("login.MetaMask")}</span>
            </button>
          </div>
          <div className="wallet-link">
            <p>Get your first wallet</p>
            <img src={arrowRight} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
