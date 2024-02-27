import React from "react";
import Sidebar from "../sidebar/Sidebar";
import { UserDashboardSection } from "../../../pages/userDashboard/userDashboard.style";
import UserSidebar from "../../userDashboard/userSidebar/UserSidebar";
import styled from "@emotion/styled";

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Sidebar>
      {/* <UserDashboardSection>
        <UserSidebar />
        {children}
      </UserDashboardSection> */}
      <WorkspaceContent>
        {/* <div className="user-dashboard"> */}
        <UserSidebar />
        <Details>
          {children}
          {/* <WorkspaceSidebar>{children}</WorkspaceSidebar> */}
        </Details>
      </WorkspaceContent>
    </Sidebar>
  );
};

export default UserDashboardLayout;

const WorkspaceContent = styled.div`
  display: flex;
`;
const Details = styled.div`
  flex: 1;
  /* min-width: 100vw; */
  overflow-y: auto;
  overflow-x: auto;
  max-height: 100vh;
`;
