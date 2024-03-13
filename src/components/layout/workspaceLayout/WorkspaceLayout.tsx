import styled from "@emotion/styled";
import WorkspaceDashboard from "../../../pages/workspaceDashboard/WorkspaceDashboard";
// import { WorkspaceContent } from "../../../pages/workspaceDashboard/WorkspaceDashboard.style";
import WorkspaceSidebar from "../../workspace/workspaceSidebar/WorkspaceSidebar";
import Sidebar from "../sidebar/Sidebar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar />
      <WorkspaceContent>
        <WorkspaceSidebar />
        <Details>{children}</Details>
      </WorkspaceContent>
    </div>
  );
};

export default WorkspaceLayout;

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
`;
