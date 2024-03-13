import logo from "../../../assets/navbar/logo.svg";
import plus from "../../../assets/dashboard/plus.svg";
import avatar from "../../../assets/dashboard/avatar.svg";
import "./sidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useWorkspace } from "../../../store/useWorkspace";
import { useEffect } from "react";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";
import styled from "@emotion/styled";
import { useAccount } from "wagmi";
import { useAuthStore } from "../../../store/useAuthStore";
import Version from "../../version";
import { getChainLogo } from "../../../utils/chain";

// const Sidebar = ({ children }: { children: React.ReactNode }) => {
const Sidebar = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
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
  console.log(getChainLogo(workspace.chain_id));

  return (
    <SidebarContainer>
      {isLoading && <Loading />}
      <SidebarSection>
        {/* logo */}
        <LeftSide>
          <Logo>
            <img src={logo} alt="" />
          </Logo>
          {/* workspace section */}
          {/* <Workspace> */}
          <WorkspaceList>
            {/* user workspaces */}
            {/* <div> */}
            {userWorkspaces.data.rows.map((workspace) => (
              <Workspace
                key={workspace.ID}
                onClick={() => handleFetchWorkspaceDetails(workspace.ID)}
              >
                {workspace.avatar === "" ? (
                  <p>{workspace.name.slice(0, 1)}</p>
                ) : (
                  <img src={workspace.avatar} alt={workspace.name} />
                )}
                <ChainLogo src={getChainLogo(workspace.chain_id)} alt="" />
              </Workspace>
            ))}
            {/* </div> */}
            <Link to="/create-workspace">
              <AddIcon>
                <img src={plus} alt="" />
              </AddIcon>
            </Link>
          </WorkspaceList>
          {/* </Workspace> */}
        </LeftSide>
        <UserBox>
          <Link to="/user/payment-request">
            <img src={avatar} alt="" />
          </Link>
          {/* <Version /> */}
        </UserBox>
      </SidebarSection>
      {/* <div className="sidebar-details">{children}</div> */}
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
  gap: 150px;
`;
const Logo = styled.div`
  img {
    width: 40px;
  }
`;
const Workspace = styled.div`
  /* margin-top: 20px; */
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--bg-primary);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  p {
    font-weight: 600;
    text-transform: uppercase;
  }
`;
const ChainLogo = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  right: 0;
  bottom: 0;
  border-radius: 50%;
`;
const AddIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--bg-primary);
  cursor: pointer;
  img {
    width: 16px;
  }
`;

const WorkspaceList = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  /* height: 100%; */
  /* overflow-y: auto; */
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
  /* div {
    display: flex;
  } */
`;

const UserBox = styled.div`
  img {
    width: 40px;
  }
  text-align: center;
  a {
    height: 100px;
  }
  .version {
    color: #ccc;
    font-size: 13px;
    margin-top: 10px;
  }
`;
