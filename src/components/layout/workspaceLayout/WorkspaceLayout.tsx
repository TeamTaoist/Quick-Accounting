import WorkspaceDashboard from "../../../pages/workspaceDashboard/WorkspaceDashboard";
import { WorkspaceContent } from "../../../pages/workspaceDashboard/WorkspaceDashboard.style";
import WorkspaceSidebar from "../../workspace/workspaceSidebar/WorkspaceSidebar";
import Sidebar from "../sidebar/Sidebar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar>
        {/* workspace sidebar */}
        <WorkspaceContent>
          <div className="user-dashboard">
            <WorkspaceSidebar>{children}</WorkspaceSidebar>
          </div>
        </WorkspaceContent>
      </Sidebar>
    </div>
  );
};

export default WorkspaceLayout;
