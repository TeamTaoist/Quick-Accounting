import file from "../../../assets/dashboard/file.svg";
import workspaceIcon from "../../../assets/dashboard/workspace-icon.svg";
import myPayment from "../../../assets/dashboard/my-payment.svg";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
// import { SidebarLinkList } from "../../workspace/workspaceSidebar/WorkspaceSidebar.style";
import SidebarLink from "../../workspace/SidebarLink";
import { useEffect, useState } from "react";
import { useDomainStore } from "../../../store/useDomain";
import styled from "@emotion/styled";
import { SidebarProps } from "../../workspace/workspaceSidebar/WorkspaceSidebar";
import Version from "../../version";
import { Box, IconButton, SvgIcon, Typography } from "@mui/material";
import CopyBox from "../../copy";
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
          <SvgIcon
            sx={{
              width: "16px",
              height: "16px",
              transform: hideSidebar ? "rotate(180deg)" : "rotate(0)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33333 11.3334L4 8.00008L7.33333 4.66675"
                stroke="#94A3B8"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11.3334L8.66663 8.00008L12 4.66675"
                stroke="#94A3B8"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SvgIcon>
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
              <SvgIcon sx={{ color: "#94A3B8", width: "12px", height: "12px" }}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.75 1H4.3C4.1 1 3.9 1.1 3.75 1.25C3.6 1.4 3.5 1.6 3.5 1.8V8.2C3.5 8.4 3.6 8.6 3.75 8.75C3.9 8.9 4.1 9 4.3 9H9.2C9.4 9 9.6 8.9 9.75 8.75C9.9 8.6 10 8.4 10 8.2V3.25L7.75 1Z"
                    stroke="currentColor"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.5 3.7998V10.1998C1.5 10.3998 1.6 10.5998 1.75 10.7498C1.9 10.8998 2.1 10.9998 2.3 10.9998H7.2"
                    stroke="currentColor"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 1V3.5H10"
                    stroke="currentColor"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SvgIcon>
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
      {!hideSidebar && (
        <BuildVersion>
          <Version />
        </BuildVersion>
      )}
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
  margin-top: 16px;
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
