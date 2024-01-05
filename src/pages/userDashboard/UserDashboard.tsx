import Sidebar from "../../components/layout/sidebar/Sidebar";
import UserSidebar from "../../components/userDashboard/userSidebar/UserSidebar";
import "./userDashboard.scss";

const UserDashboard = () => (
  <div>
    <Sidebar>
      <div className="user-dashboard">
        <UserSidebar>
          <div className="details">
            <h2>You don't have any payment request</h2>
          </div>
        </UserSidebar>
      </div>
    </Sidebar>
  </div>
);

export default UserDashboard;
