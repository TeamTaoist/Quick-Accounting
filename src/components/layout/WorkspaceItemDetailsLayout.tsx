import styled from "@emotion/styled";
import React from "react";
import cancel from "../../assets/auth/cancel.svg";
import { useNavigate } from "react-router-dom";
import { Workspace } from "../../store/useWorkspace";

interface WorkspaceItemProps {
  children: React.ReactNode;
  title: string;
  href?: string;
  subtitle?: string;
  setOpen: (open: boolean) => void;
  // workspaceInfo?: Workspace;
  workspaceName?: string;
  workspaceAvatar?: string;
  address?: string;
}

const WorkspaceItemDetailsLayout = ({
  children,
  title,
  href,
  subtitle,
  setOpen,
  workspaceName,
  workspaceAvatar,
  address,
}: WorkspaceItemProps) => {
  return (
    <WorkspaceItemContainer>
      <Request>
        <RequestHeader>
          <HeaderDescription>
            <h1>{title}</h1>
            <p>{subtitle}</p>
            {workspaceName && (
              <WorkspaceInfo>
                <WorkspaceLogo>
                  {workspaceAvatar === "" ? (
                    <p>{workspaceName?.slice(0, 1)}</p>
                  ) : (
                    <img src={workspaceAvatar} alt={workspaceName} />
                  )}
                </WorkspaceLogo>
                <WorkspaceDetails>
                  <h6>{workspaceName}</h6>
                  <p>{address}</p>
                </WorkspaceDetails>
              </WorkspaceInfo>
            )}
          </HeaderDescription>
          <img onClick={() => setOpen(false)} src={cancel} alt="" />
        </RequestHeader>
        {children}
      </Request>
    </WorkspaceItemContainer>
  );
};

export default WorkspaceItemDetailsLayout;

const WorkspaceItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;
export const Request = styled.div`
  width: 800px;
  height: 480px;
  border: 1px solid var(--border-table);
  border-radius: 10px;
  overflow: scroll;
  background: #fff;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
export const RequestHeader = styled.div`
  height: 152px;
  /* min-height: 90px; */
  background: var(--clr-gray-100);
  /* padding: 30px 40px; */
  position: relative;
  /* line-height: 32px; */
  display: flex;
  align-items: center;
  padding-inline: 40px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  img {
    width: 16px;
    cursor: pointer;
    position: absolute;
    top: 30px;
    right: 40px;
  }
`;
const HeaderDescription = styled.div`
  line-height: 20px;
  margin-top: 6px;
  h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  /* P {
    font-size: 14px;
    font-weight: 500;
    color: var(--clr-gray-500)
  } */
`;
const WorkspaceInfo = styled.div`
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const WorkspaceDetails = styled.div`
  h6 {
    font-size: 14px;
    font-weight: 500;
  }
  p {
    font-size: 12px;
    font-weight: 400;
    color: var(--clr-gray-500);
  }
`;
const WorkspaceLogo = styled.div`
  /* margin-top: 20px; */
  padding: 14px 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--clr-gray-200);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-weight: 400;
    text-transform: uppercase;
  }
`;
