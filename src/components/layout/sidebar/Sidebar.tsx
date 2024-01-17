import logo from "../../../assets/navbar/logo.svg";
import plus from "../../../assets/dashboard/plus.svg";
import avatar from "../../../assets/dashboard/avatar.svg";
import "./sidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useWorkspace } from "../../../store/useWorkspace";
import { useEffect } from "react";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
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
        </div>
        <Link to="/user">
          <div className="user">
            <img src={avatar} alt="" />
          </div>
        </Link>
      </div>
      <div className="sidebar-details">{children}</div>
    </div>
  );
};

export default Sidebar;
