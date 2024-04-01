import React from "react";
import Sidebar from "../sidebar/Sidebar";
import UserSidebar from "../../userDashboard/userSidebar/UserSidebar";
import styled from "@emotion/styled";

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Sidebar />
      <WorkspaceContent>
        <UserSidebar />
        <Details>{children}</Details>
      </WorkspaceContent>
    </>
  );
};

export default UserDashboardLayout;

const WorkspaceContent = styled.div`
  display: flex;
  padding-top: 72px;
  max-height: 100vh;
`;
const Details = styled.div`
  flex: 1;
  /* min-width: 100vw; */
  overflow-y: auto;
  overflow-x: auto;
  max-height: 100vh;
  background: var(--clr-gray-50);
`;
