import logo from "../../../assets/navbar/logo.svg";
// import plus from "../../../assets/dashboard/plus.svg";
import plus from "../../../assets/workspace/add.svg";
import avatar from "../../../assets/dashboard/avatar.svg";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "../../../store/useWorkspace";
import { useEffect, useRef, useState } from "react";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";
import styled from "@emotion/styled";
import { useAccount } from "wagmi";
import { useAuthStore } from "../../../store/useAuthStore";
import Version from "../../version";
import { getChainLogo } from "../../../utils/chain";
import { Box, Popover, SvgIcon, Typography } from "@mui/material";
import { useDomainStore } from "../../../store/useDomain";
import CopyBox from "../../copy";

// const Sidebar = ({ children }: { children: React.ReactNode }) => {
const Sidebar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();

  const { address, chainId } = useAccount();
  const { user } = useAuthStore();
  const { getUserWorkspace, userWorkspaces, getWorkspaceDetails, workspace } =
    useWorkspace();
  const { isLoading } = useLoading();

  useEffect(() => {
    getUserWorkspace();
  }, [getUserWorkspace]);

  // fetch single workspace
  const handleFetchWorkspaceDetails = (workspaceId: number) => {
    getWorkspaceDetails(workspaceId, navigate);
  };

  useEffect(() => {
    if (address && user?.wallet && address !== user.wallet) {
      navigate("/login");
    }
  }, [address, user]);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const { queryENS, formatAddressToDomain } = useDomainStore();
  useEffect(() => {
    if (address && chainId) {
      queryENS([address], chainId);
    }
  }, [address, chainId]);

  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <SidebarContainer>
      {isLoading && <Loading />}
      <SidebarSection>
        {/* logo */}
        <LeftSide>
          <Logo>
            <img src={logo} alt="" />
            <h5>Quick Accounting</h5>
          </Logo>
          {/* workspace section */}
          {/* <Workspace> */}
          <WorkspaceList>
            {/* user workspaces */}
            {userWorkspaces.data.rows.map((workspace) => (
              <Workspace
                active={Number(id) === workspace.ID}
                key={workspace.ID}
                onClick={() => handleFetchWorkspaceDetails(workspace.ID)}
                style={
                  Number(id) === workspace.ID
                    ? {
                        backgroundColor: "var(--clr-gray-600)",
                        color: "white",
                      }
                    : undefined
                }
              >
                {workspace.avatar === "" ? (
                  <p>{workspace.name.slice(0, 1)}</p>
                ) : (
                  <img src={workspace.avatar} alt={workspace.name} />
                )}
                <ChainLogo src={getChainLogo(workspace.chain_id)} alt="" />
              </Workspace>
            ))}
            <Link to="/create-workspace">
              <AddIcon>
                <img src={plus} alt="" />
              </AddIcon>
            </Link>
          </WorkspaceList>
          {/* </Workspace> */}
        </LeftSide>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          sx={{
            ".MuiPopover-paper": {
              overflow: "auto",
              boxShadow: "none",
              borderRadius: "6px",
              padding: "12px",
              border: "1px solid var(--clr-gray-200)",
            },
          }}
        >
          <CopyBox text={address as string} dir="bottom">
            <Typography sx={{ color: "var(--clr-gray-600)" }} fontSize={14}>
              {address &&
                chainId &&
                formatAddressToDomain(address, chainId, false)}
            </Typography>{" "}
            <SvgIcon sx={{ color: "#475569", width: "12px", height: "12px" }}>
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

          <Link to="/user/payment-request">
            <Box display="flex" alignItems="center" gap="6px" marginTop="12px">
              <SvgIcon sx={{ width: "16px", height: "16px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.6673 14V12.6667C12.6673 11.9594 12.3864 11.2811 11.8863 10.781C11.3862 10.281 10.7079 10 10.0007 10H6.00065C5.29341 10 4.61513 10.281 4.11503 10.781C3.61494 11.2811 3.33398 11.9594 3.33398 12.6667V14"
                    stroke="#334155"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.00065 7.33333C9.47341 7.33333 10.6673 6.13943 10.6673 4.66667C10.6673 3.19391 9.47341 2 8.00065 2C6.52789 2 5.33398 3.19391 5.33398 4.66667C5.33398 6.13943 6.52789 7.33333 8.00065 7.33333Z"
                    stroke="#334155"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </SvgIcon>

              <Typography
                fontSize={14}
                fontWeight={500}
                color="var(--clr-gray-700)"
              >
                My account
              </Typography>
            </Box>
          </Link>

          <Box
            display="flex"
            alignItems="center"
            gap="6px"
            marginTop="6px"
            sx={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            <SvgIcon sx={{ width: "16px", height: "16px" }}>
              <svg
                width="10"
                height="14"
                viewBox="0 0 10 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_10733_9251"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="10"
                  height="14"
                >
                  <path d="M0 0H9.12197V14H0V0Z" fill="white" />
                </mask>
                <g mask="url(#mask0_10733_9251)">
                  <path
                    d="M7.16888 0.00195312C8.195 0.00195312 8.195 1.56228 7.16888 1.56228H1.56423V12.4412H7.16888C8.195 12.4412 8.195 14.0013 7.16888 14.0013H0.784024C0.353451 14.0013 0.00390625 13.652 0.00390625 13.2215V0.781979C0.00390625 0.351224 0.353451 0.00195312 0.784024 0.00195312H7.16888ZM2.67931 6.22147C1.65346 6.22147 1.65346 7.78162 2.67931 7.78162H6.45165L5.56772 8.66537C4.84229 9.39098 5.94552 10.4939 6.67086 9.76859L8.88197 7.55767C9.17992 7.25953 9.2049 6.76853 8.88197 6.44533L6.67086 4.23467C5.94552 3.50925 4.84229 4.61229 5.56772 5.3379L6.45165 6.22147H2.67931Z"
                    fill="#334155"
                  />
                </g>
              </svg>
            </SvgIcon>

            <Typography
              fontSize={14}
              fontWeight={500}
              color="var(--clr-gray-700)"
            >
              Log out
            </Typography>
          </Box>
        </Popover>

        <UserBox onClick={handleClick}>
          <SvgIcon
            sx={{
              color: pathname.startsWith("/user") ? "#475569" : "#cbd5e1",
              width: "40px",
              height: "40px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="800"
              zoomAndPan="magnify"
              viewBox="0 0 600 599.999999"
              height="800"
              preserveAspectRatio="xMidYMid meet"
              version="1.0"
            >
              <defs>
                <clipPath id="2eba8bec87">
                  <path
                    d="M 300 0 C 134.316406 0 0 134.316406 0 300 C 0 465.683594 134.316406 600 300 600 C 465.683594 600 600 465.683594 600 300 C 600 134.316406 465.683594 0 300 0 Z M 300 0 "
                    clip-rule="nonzero"
                  />
                </clipPath>
              </defs>
              <g clip-path="url(#2eba8bec87)">
                <rect
                  x="-60"
                  width="720"
                  fill="#ffffff"
                  y="-60"
                  height="719.999999"
                  fill-opacity="1"
                />
              </g>
              <path
                fill="currentColor"
                d="M 300 0 C 134.3125 0 0 134.316406 0 300 C 0 465.6875 134.3125 600 300 600 C 465.683594 600 600 465.6875 600 300 C 600 134.316406 465.683594 0 300 0 Z M 300 105.46875 C 343.382812 105.46875 378.550781 147.03125 378.550781 198.304688 C 378.550781 249.574219 343.382812 291.136719 300 291.136719 C 256.617188 291.136719 221.449219 249.574219 221.449219 198.304688 C 221.449219 147.03125 256.617188 105.46875 300 105.46875 Z M 432.960938 471.09375 L 167.039062 471.09375 C 153.707031 471.09375 142.894531 460.285156 142.894531 446.949219 C 142.894531 384.5625 213.234375 333.984375 300 333.984375 C 386.765625 333.984375 457.105469 384.5625 457.105469 446.949219 C 457.105469 460.285156 446.296875 471.09375 432.960938 471.09375 Z M 432.960938 471.09375 "
                fill-opacity="1"
                fill-rule="nonzero"
              />
            </svg>
          </SvgIcon>
          {/* <Version /> */}
        </UserBox>
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div``;
const SidebarSection = styled.div`
  padding: 10px 20px;
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--clr-gray-200);
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
`;
const LeftSide = styled.div`
  display: flex;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 73px;
  h5 {
    font-size: 16px;
    font-weight: 700;
  }
  img {
    width: 40px;
    height: 40px;
  }
`;
const WorkspaceList = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  /* height: 100%; */
  /* overflow-y: auto; */
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

const Workspace = styled.div<{ size?: "large" | "base"; active?: boolean }>`
  width: ${({ size, active }) =>
    size === "large" || active ? "44px" : "40px"};
  height: ${({ size, active }) =>
    size === "large" || active ? "44px" : "40px"};
  border-radius: 50%;
  background: var(--clr-gray-200);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  p {
    font-size: 14px;
    font-weight: 400;
    text-transform: uppercase;
  }
`;
const ChainLogo = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(40%, 10%);
  border-radius: 50%;
`;
const AddIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--clr-gray-200);
  border-radius: 50%;
  color: #111;
  cursor: pointer;
  img {
    width: 16px;
  }
`;

const UserBox = styled.div`
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  text-align: center;
  cursor: pointer;
  a {
    height: 100px;
  }
  .version {
    color: #ccc;
    font-size: 13px;
    margin-top: 10px;
  }
`;
