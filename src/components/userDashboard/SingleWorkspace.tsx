import styled from "@emotion/styled";
import { Workspace, useWorkspace } from "../../store/useWorkspace";
import { getChainLogo } from "../../utils/chain";
import { getShortAddress } from "../../utils";
import { useNavigate } from "react-router-dom";

interface SingleWorkspaceProps {
  workspace: Workspace;
}

const SingleWorkspace = ({ workspace }: SingleWorkspaceProps) => {
  const navigate = useNavigate();
  const { getWorkspaceDetails } = useWorkspace();

  // fetch workspace
  const handleFetchWorkspaceDetails = (workspaceId: number) => {
    getWorkspaceDetails(workspaceId, navigate);
    console.log(workspaceId);
  };
  return (
    <SingleWorkspaceSection
      onClick={() => handleFetchWorkspaceDetails(workspace.ID)}
    >
      <Logo
      // isActive={id === workspace.ID}
      >
        {workspace.avatar === "" ? (
          <p>{workspace.name.slice(0, 1)}</p>
        ) : (
          <img src={workspace.avatar} alt={workspace.name} />
        )}
        <ChainLogo src={getChainLogo(workspace.chain_id)} alt="" />
      </Logo>
      <h5>{workspace.name}</h5>
      <p>{getShortAddress(workspace.vault_wallet)}</p>
    </SingleWorkspaceSection>
  );
};

export default SingleWorkspace;

const SingleWorkspaceSection = styled.div`
  width: 266px;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--clr-gray-200);
  box-shadow: 0px 4px 6px 0px var(--clr-gray-200);
  border-radius: 6px;
  cursor: pointer;
  h5 {
    font-size: 16px;
    font-weight: 700px;
    color: var(--clr-primary-900);
    padding: 12px 0 4px 0;
  }
  p {
    font-size: 14px;
    font-weight: 400;
  }
`;
const Logo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--clr-gray-200);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  p {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
  }
`;
const ChainLogo = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(40%, 10%);
  border-radius: 50%;
`;
