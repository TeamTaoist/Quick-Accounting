import styled from "@emotion/styled";
import { useWorkspace } from "../../store/useWorkspace";
import SingleWorkspace from "../../components/userDashboard/SingleWorkspace";
import { Link } from "react-router-dom";
import plus from "../../assets/workspace/add.svg";

const WorkspaceList = () => {
  const { userWorkspaces } = useWorkspace();
  return (
    <WorkspaceListContainer>
      <Workspaces>
        {userWorkspaces.data.rows.map((workspace) => (
          <SingleWorkspace workspace={workspace} />
        ))}
        <Link to="/create-workspace">
          <CreateWorkspaceBtn>
            <AddIcon>
              <img src={plus} alt="" />
            </AddIcon>
            <p>Create a workspace</p>
          </CreateWorkspaceBtn>
        </Link>
      </Workspaces>
    </WorkspaceListContainer>
  );
};

export default WorkspaceList;

const WorkspaceListContainer = styled.div`
  padding: 24px;
  width: 1136px;
`;
const Workspaces = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
`;
const CreateWorkspaceBtn = styled.div`
  width: 266px;
  height: 124px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--clr-gray-200);
  box-shadow: 0px 4px 6px 0px var(--clr-gray-200);
  border-radius: 6px;
  cursor: pointer;
  color: var(--clr-primary-900);
  background-color: #fff;
  p {
    font-size: 16px;
    font-weight: 400;
  }
`;
const AddIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--clr-gray-200);
  border-radius: 50%;
  color: #111;
  cursor: pointer;
  img {
    width: 16px;
  }
`;
