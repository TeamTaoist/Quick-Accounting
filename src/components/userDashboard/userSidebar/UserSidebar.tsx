import addressCard from "../../../assets/dashboard/address-card.svg";
import file from "../../../assets/dashboard/file.svg";
import workspaceIcon from "../../../assets/dashboard/workspace-icon.svg";
import myPayment from "../../../assets/dashboard/my-payment.svg";
import arrow from "../../../assets/workspace/arrow.svg";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { getShortAddress } from "../../../utils/index";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
// import { SidebarLinkList } from "../../workspace/workspaceSidebar/WorkspaceSidebar.style";
import SidebarLink from "../../workspace/SidebarLink";
import { useEffect, useState } from "react";
import { useDomainStore } from "../../../store/useDomain";
import styled from "@emotion/styled";
import { SidebarProps } from "../../workspace/workspaceSidebar/WorkspaceSidebar";
import Version from "../../version";

const UserSidebar = () => {
  const { t } = useTranslation();
  const { address, chainId } = useAccount();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout(navigate);
  };
  const [hideSidebar, setHideSidebar] = useState(false);
  const handleSidebar = () => {
    setHideSidebar(!hideSidebar);
  };
  const { queryENS, formatAddressToDomain } = useDomainStore();

  useEffect(() => {
    if (address && chainId) {
      queryENS([address], chainId);
    }
  }, [address, chainId]);
  return (
    <UserSidebarSection hideSidebar={hideSidebar}>
      {/* user address */}
      <Address hideSidebar={hideSidebar}>
        {!hideSidebar && (
          <h5>
            {address &&
              chainId &&
              formatAddressToDomain(address, chainId, false)}
          </h5>
        )}

        <img
          onClick={handleSidebar}
          className="arrow-icon"
          src={arrow}
          alt=""
        />
      </Address>
      {!hideSidebar && (
        <Disconnect>
          <button onClick={handleLogout}>{t("user.Disconnect")}</button>
        </Disconnect>
      )}

      {/* user payment request */}
      <SidebarLinkList hideSidebar={hideSidebar}>
        <SidebarLink
          icon={workspaceIcon}
          name="Workspace"
          to={`/user/workspaces`}
          hideSidebar={hideSidebar}
        />
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
      <BuildVersion>
        <Version />
      </BuildVersion>
    </UserSidebarSection>
  );
};

export default UserSidebar;

const UserSidebarSection = styled.div<SidebarProps>`
  border-right: 1px solid var(--clr-gray-300);
  /* width: 256px; */
  width: ${({ hideSidebar }) => (hideSidebar ? "88px" : "256px")};
  height: calc(100vh - 72px);
  position: relative;
  padding: 20px;
  transition: width 0.3s ease-in-out;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const Address = styled.div<SidebarProps>`
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  gap: 9px;
  padding: 8px 0;
  justify-content: ${({ hideSidebar }) =>
    hideSidebar ? "center" : "space-between"};
  img {
    width: 16px;
    transform: ${({ hideSidebar }) => hideSidebar && "rotate(180deg)"};
    cursor: pointer;
  }
  h5 {
    font-size: 16px;
    overflow: hidden;
    &:hover {
      color: var(--clr-gray-600);
    }
  }
`;
const Disconnect = styled.div`
  overflow: hidden;
  margin: 10px 0;
  button {
    border: 1px solid var(--clr-gray-300);
    outline: none;
    background: transparent;
    font-size: 15px;
    padding: 14px 0;
    border-radius: 7px;
    cursor: pointer;
    width: 100%;
  }
`;
const SidebarLinkList = styled.div<SidebarProps>`
  margin-top: ${({ hideSidebar }) => (hideSidebar ? "38px" : "30px")};
`;
export const BuildVersion = styled.div`
  position: fixed;
  bottom: 20px;
  left: 10px;
`;
