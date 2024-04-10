import styled from "@emotion/styled";
import React from "react";
import cancel from "../../assets/x.svg";
import UpdateLoading from "../UpdateLoading";

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
  isUpdating?: boolean | undefined;
  isSuccess?: boolean | undefined;
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
  isUpdating,
  isSuccess,
}: WorkspaceItemProps) => {
  return (
    <WorkspaceItemContainer>
      <Request>
        <RequestHeader>
          <HeaderTitle>
            <div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            <img onClick={() => setOpen(false)} src={cancel} alt="" />
          </HeaderTitle>
          <WorkspaceInfo>
            <WorkspaceItem>
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
            </WorkspaceItem>
            <UpdateInfo>
              <UpdateLoading isUpdating={isUpdating} isSuccess={isSuccess} />
            </UpdateInfo>
          </WorkspaceInfo>
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
  height: 550px;
  border: 1px solid var(--clr-gray-200);
  border-radius: 6px;
  overflow: scroll;
  background: #fff;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
export const RequestHeader = styled.div`
  height: 126px;
  background: var(--clr-gray-200);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: 40px;
  gap: 20px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;
export const HeaderTitle = styled.div`
  display: flex;
  justify-content: space-between;
  /* padding: 22px 26px; */

  h1 {
    font-size: 20px;
    font-weight: 600;
  }
  p {
    font-size: 14px;
    font-weight: 500;
    color: var(--clr-gray-500);
  }
  img {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;
export const WorkspaceInfo = styled.div`
  display: flex;
  gap: 7px;
  justify-content: space-between;
  /* align-items: flex-end; */
`;
export const WorkspaceItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
export const WorkspaceLogo = styled.div`
  /* margin-top: 20px; */
  padding: 14px 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--clr-gray-300);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
  }
`;
export const WorkspaceDetails = styled.div`
  line-height: 18px;
  h6 {
    font-size: 14px;
    font-weight: 500;
  }
  p {
    font-size: 12px;
    font-weight: 500;
    color: var(--clr-gray-500);
  }
`;
export const UpdateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 11px;
  img {
    width: 16px;
  }
  p {
    font-size: 12px;
    font-weight: 400;
    color: var(--clr-gray-500);
  }
`;
