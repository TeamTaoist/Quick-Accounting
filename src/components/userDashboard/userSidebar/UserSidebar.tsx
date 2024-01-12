import "./userSidebar.scss";
import addressCard from "../../../assets/dashboard/address-card.svg";
import file from "../../../assets/dashboard/file.svg";
import { useTranslation } from "react-i18next";

const UserSidebar = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="user-sidebar">
        {/* user address */}
        <div className="user-address">
          <div className="address">
            <img src={addressCard} alt="" />
            <p>0x4dgf...2915</p>
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
