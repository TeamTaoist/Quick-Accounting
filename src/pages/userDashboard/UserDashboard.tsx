import Sidebar from "../../components/layout/sidebar/Sidebar";
import UserSidebar from "../../components/userDashboard/userSidebar/UserSidebar";
import UserPaymentRequest from "./UserPaymentRequest";
import { UserDashboardSection } from "./userDashboard.style";

const UserDashboard = () => (
  <div>
    <Sidebar>
      <UserDashboardSection>
        <UserSidebar>
          {/* <div className="details">
            <h2>You don't have any payment request</h2>
          </div> */}
          {/* payment table */}
          <UserPaymentRequest />
        </UserSidebar>
      </UserDashboardSection>
    </Sidebar>
  </div>
);

export default UserDashboard;
