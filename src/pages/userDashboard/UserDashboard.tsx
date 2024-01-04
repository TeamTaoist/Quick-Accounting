import Sidebar from "../../components/layout/sidebar/Sidebar";
import UserSidebar from "../../components/userDashboard/userSidebar/UserSidebar";
import "./userDashboard.scss";

const UserDashboard = () => (
  <div>
    <Sidebar>
      <UserSidebar />
    </Sidebar>
  </div>
);

export default UserDashboard;
