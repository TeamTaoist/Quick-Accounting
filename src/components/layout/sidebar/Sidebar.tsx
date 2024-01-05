import logo from "../../../assets/navbar/logo.svg";
import plus from "../../../assets/dashboard/plus.svg";
import avatar from "../../../assets/dashboard/avatar.svg";
import "./sidebar.scss";
import { Link } from "react-router-dom";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        {/* logo */}
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        {/* workspace section */}
        <div className="workspace">
          <div className="workspace-logo">
            <img src={logo} alt="" />
          </div>
          <Link to="/create-workspace">
            <img className="plus-icon" src={plus} alt="" />
          </Link>
        </div>
        <div className="user">
          <img src={avatar} alt="" />
        </div>
      </div>
      <div className="sidebar-details">{children}</div>
    </div>
  );
};

export default Sidebar;
