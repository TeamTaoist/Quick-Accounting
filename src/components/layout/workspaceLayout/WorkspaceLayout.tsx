import styled from "@emotion/styled";
import WorkspaceDashboard from "../../../pages/workspaceDashboard/WorkspaceDashboard";
// import { WorkspaceContent } from "../../../pages/workspaceDashboard/WorkspaceDashboard.style";
import WorkspaceSidebar from "../../workspace/workspaceSidebar/WorkspaceSidebar";
import Sidebar from "../sidebar/Sidebar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar>
        {/* workspace sidebar */}
        <WorkspaceContent>
          {/* <div className="user-dashboard"> */}
          <WorkspaceSidebar />
          <Details>
            {children}
            {/* <WorkspaceSidebar>{children}</WorkspaceSidebar> */}
          </Details>
        </WorkspaceContent>
      </Sidebar>
    </div>
  );
};

export default WorkspaceLayout;

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
