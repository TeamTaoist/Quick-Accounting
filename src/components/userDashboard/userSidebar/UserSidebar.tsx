import "./userSidebar.scss";
import addressCard from "../../../assets/dashboard/address-card.svg";
import file from "../../../assets/dashboard/file.svg";
import myPayment from "../../../assets/dashboard/my-payment.svg";
import arrow from "../../../assets/workspace/arrow.svg";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { getShortAddress } from "../../../utils/index";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { SidebarLinkList } from "../../workspace/workspaceSidebar/WorkspaceSidebar.style";
import SidebarLink from "../../workspace/SidebarLink";
import { useEffect, useState } from "react";
import { useDomainStore } from "../../../store/useDomain";

const UserSidebar = () => {
  const { t } = useTranslation();
  const { address, chainId } = useAccount();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout(navigate);
  };
  const [hideSidebar, setHideSidebar] = useState(false);
  const { queryENS, formatAddressToDomain } = useDomainStore();

  useEffect(() => {
    if (address && chainId) {
      queryENS([address], chainId);
    }
  }, [address, chainId]);
  return (
    <>
      <div className="user-sidebar">
        <img className="arrow-icon" src={arrow} alt="" />
        {/* user address */}
        <div className="user-address">
          <div className="address">
            <img src={addressCard} alt="" />
            <p>
              {address &&
                chainId &&
                formatAddressToDomain(address, chainId, false)}
            </p>
          </div>
          <button onClick={handleLogout} className="disconnect">
            {t("user.Disconnect")}
          </button>
        </div>
        {/* user payment request */}
        <SidebarLinkList className="">
          <SidebarLink
            icon={file}
            name="My payment requests"
            to={`/user/payment-request`}
            hideSidebar={hideSidebar}
          />
          <SidebarLink
            icon={myPayment}
            name="My payments"
            to={`/user/my-payments`}
            hideSidebar={hideSidebar}
          />
        </SidebarLinkList>
      </div>
      {/* {children} */}
    </>
  );
};

export default UserSidebar;
