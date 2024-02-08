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
import config from "../../../envConfig";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
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

  return (
    <div className="sidebar-container">
      {isLoading && <Loading />}
      <div className="sidebar">
        {/* logo */}
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        {/* workspace section */}
        <div className="workspace">
          <WorkspaceList>
            {/* user workspaces */}
            <div className="user-workspaces">
              {userWorkspaces.data.rows.map((workspace) => (
                // <Link to="/assets">
                <div
                  key={workspace.ID}
                  className="workspace-logo"
                  onClick={() => handleFetchWorkspaceDetails(workspace.ID)}
                >
                  {workspace.avatar === "" ? (
                    <p>{workspace.name.slice(0, 1)}</p>
                  ) : (
                    <img src={workspace.avatar} alt={workspace.name} />
                  )}
                </div>
                // </Link>
              ))}
            </div>
            <Link to="/create-workspace">
              <img className="plus-icon" src={plus} alt="" />
            </Link>
          </WorkspaceList>
        </div>
        <UserBox>
          <Link to="/user">
            {/* <div className="user"> */}
            <img src={avatar} alt="" />
            {/* </div> */}
          </Link>
          <p className="version">
            {config.version} {process.env.REACT_APP_BUILD_ID?.slice(0, 6)}
          </p>
        </UserBox>
      </div>
      <div className="sidebar-details">{children}</div>
    </div>
  );
};

export default Sidebar;

const WorkspaceList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

const UserBox = styled.div`
  height: 130px;
  width: 131px;
  padding-top: 35px;
  border-top: 1px solid var(--border);
  img {
    width: 55px;
    margin-left: 35px;
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
