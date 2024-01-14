import "./userSidebar.scss";
import addressCard from "../../../assets/dashboard/address-card.svg";
import file from "../../../assets/dashboard/file.svg";
import arrow from "../../../assets/workspace/arrow.svg";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { getShortAddress } from "../../../utils/index";

const UserSidebar = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  return (
    <>
      <div className="user-sidebar">
        <img className="arrow-icon" src={arrow} alt="" />
        {/* user address */}
        <div className="user-address">
          <div className="address">
            <img src={addressCard} alt="" />
            <p>{getShortAddress(address || "")}</p>
          </div>
          <button className="disconnect">{t("user.Disconnect")}</button>
        </div>
        {/* user payment request */}
        <div className="payment-request">
          <ul>
            <li>
              <img className="file" src={file} alt="" />
              <span>{t("user.MyPayment")}</span>
            </li>
          </ul>
        </div>
      </div>
      {children}
    </>
  );
};

export default UserSidebar;
