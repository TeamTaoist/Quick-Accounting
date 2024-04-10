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
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowImg } from "../../workspace/workspaceSidebar/WorkspaceSidebar.style";
import CopyBox from "../../copy";
import CopyIcon from "../../../assets/copy.svg";
import AvatarIcon from "../../../assets/dashboard/avatar.svg";

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
      <SidebarHeader hideSidebar={hideSidebar}>
        <Typography color="#64748B" fontSize="14px" fontWeight={400}>
          MY ACCOUNT
        </Typography>

        <IconButton onClick={handleSidebar}>
          <img
            onClick={handleSidebar}
            className="arrow-icon"
            src={arrow}
            alt=""
          />
        </IconButton>
      </SidebarHeader>

      {/* user address */}
      <AuthDetails hideSidebar={hideSidebar}>
        {!hideSidebar && (
          <Address hideSidebar={hideSidebar}>
            <CopyBox text={address as string}>
              <h5>
                {address &&
                  chainId &&
                  formatAddressToDomain(address, chainId, false)}
              </h5>
              <img src={CopyIcon} alt="" />
            </CopyBox>
          </Address>
        )}
        {/* {!hideSidebar && (
          <Disconnect>
            <button onClick={handleLogout}>{t("user.Disconnect")}</button>
          </Disconnect>
        )} */}
      </AuthDetails>

      {/* user payment request */}
      <SidebarLinkList hideSidebar={hideSidebar}>
        <Box
          sx={{
            display: hideSidebar ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            padding: "6px 8px",
            marginBottom: "10px",
          }}
        >
          <Avatar src={AvatarIcon} alt="" />
        </Box>

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

const Avatar = styled.img`
  width: 14px;
  height: 14px;
`;

const UserSidebarSection = styled.div<SidebarProps>`
  border-right: 1px solid var(--clr-gray-300);
  /* width: 256px; */
  width: ${({ hideSidebar }) => (hideSidebar ? "88px" : "256px")};
  height: calc(100vh - 72px);
  position: relative;
  padding: 23.5px;
  transition: width 0.3s ease-in-out;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const AuthDetails = styled.div<SidebarProps>``;
const Address = styled.div<SidebarProps>`
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  justify-content: ${({ hideSidebar }) =>
    hideSidebar ? "center" : "space-between"};
  gap: 8px;
  img {
    width: 10px;
    transform: ${({ hideSidebar }) => hideSidebar && "rotate(180deg)"};
    cursor: pointer;
  }
  h5 {
    font-size: 12px;
    overflow: hidden;
    font-weight: 400;
    color: var(--clr-gray-400);
  }
`;
const Disconnect = styled.div`
  overflow: hidden;
  margin-top: 6px;
  button {
    border: 1px solid var(--clr-gray-300);
    outline: none;
    background: var(--clr-white);
    font-size: 12px;
    font-weight: 500;
    height: 24px;
    width: 89px;
    border-radius: 6px;
    cursor: pointer;
  }
`;
const SidebarLinkList = styled.div<SidebarProps>`
  margin-top: ${({ hideSidebar }) => (hideSidebar ? "38px" : "16px")};
`;
export const BuildVersion = styled.div`
  position: fixed;
  bottom: 20px;
  left: 23.5px;
`;

const SidebarHeader = styled.div<SidebarProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    width: 16px;
    transform: ${({ hideSidebar }) => hideSidebar && "rotate(180deg)"};
    cursor: pointer;
  }
  p {
    display: ${({ hideSidebar }) => (hideSidebar ? "none" : "flex")};
  }
`;
