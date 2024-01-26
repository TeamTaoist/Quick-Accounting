import { useEffect } from "react";
import Sidebar from "../../components/layout/sidebar/Sidebar";
import UserSidebar from "../../components/userDashboard/userSidebar/UserSidebar";
import { useUserPayment } from "../../store/useUserPayment";
import UserPaymentRequest from "./UserPaymentRequest";
import { Details, UserDashboardSection } from "./userDashboard.style";
import { useLoading } from "../../store/useLoading";
import Loading from "../../utils/Loading";

const UserDashboard = () => {
  const { getUserPayment, userPayment } = useUserPayment();
  const { isLoading } = useLoading();
  // get user payment request
  useEffect(() => {
    getUserPayment();
  }, [getUserPayment]);
  return (
    <div>
      {isLoading && <Loading />}
      <Sidebar>
        <UserDashboardSection>
          <UserSidebar>
            {userPayment.length === 0 ? (
              <Details>
                <h2>
                  You don't have any payment <br /> request
                </h2>
              </Details>
            ) : (
              /* payment table */
              <UserPaymentRequest />
            )}
          </UserSidebar>
        </UserDashboardSection>
      </Sidebar>
    </div>
  );
};

export default UserDashboard;
