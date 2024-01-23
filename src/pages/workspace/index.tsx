import { Outlet } from "react-router-dom";
import WorkspaceLayout from "../../components/layout/workspaceLayout/WorkspaceLayout";

export default function WorkspaceIndex() {
  return (
    <WorkspaceLayout>
      <Outlet />
    </WorkspaceLayout>
  );
}
