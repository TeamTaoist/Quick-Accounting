import styled from "@emotion/styled";
import React from "react";
import cancel from "../../assets/auth/cancel.svg";
import { useNavigate } from "react-router-dom";

interface WorkspaceItemProps {
  children: React.ReactNode;
  title: string;
  href?: string;
  subtitle?: string;
  setOpen: (open: boolean) => void;
  // data?: IPaymentRequest;
  data?: any;
}

const WorkspaceItemDetailsLayout = ({
  children,
  title,
  href,
  subtitle,
  setOpen,
  data,
}: WorkspaceItemProps) => {
  return (
    <WorkspaceItemContainer>
      <Request>
        <RequestHeader>
          <HeaderDescription>
            <h1>{title}</h1>
            <p>{subtitle}</p>
            <WorkspaceInfo>
              <WorkspaceLogo>
                {data?.workspace_avatar === "" ? (
                  <p>{data?.workspace_name.slice(0, 1)}</p>
                ) : (
                  <img
                    src={data?.workspace_avatar}
                    alt={data?.workspace_name}
                  />
                )}
              </WorkspaceLogo>
              <WorkspaceDetails>
                <h6>{data.workspace_name}</h6>
                <p>{data.address}</p>
              </WorkspaceDetails>
            </WorkspaceInfo>
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
  display: grid;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;
export const Request = styled.div`
  //margin-top: 92px;
  width: 757px;
  border: 1px solid var(--border-table);
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
`;
export const RequestHeader = styled.div`
  height: 110px;
  background: var(--bg-secondary);
  padding: 10px 26px;
  position: relative;
  img {
    width: 20px;
    cursor: pointer;
    position: absolute;
    top: 24px;
    right: 40px;
  }
`;
const HeaderDescription = styled.div`
  h1 {
    font-size: 24px;
    font-weight: 500;
  }
`;
const WorkspaceInfo = styled.div`
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const WorkspaceDetails = styled.div`
  h6 {
    font-size: 12px;
    font-weight: 500;
  }
  p {
    font-size: 12px;
    font-weight: 400;
    color: var(--text-secondary);
  }
`;
const WorkspaceLogo = styled.div`
  /* margin-top: 20px; */
  padding: 14px 0;
  width: 30px;
  height: 30px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--bg-primary);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-weight: 600;
    text-transform: uppercase;
  }
`;
