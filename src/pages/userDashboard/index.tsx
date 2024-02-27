import { Outlet } from "react-router-dom";
import UserDashboardLayout from "../../components/layout/userDashboardLayout/UserDashboardLayout";

export default function UserDashboardIndex() {
  return (
    <UserDashboardLayout>
      <Outlet />
    </UserDashboardLayout>
  );
}
