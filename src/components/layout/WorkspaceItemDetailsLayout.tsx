import styled from "@emotion/styled";
import React from "react";
import cancel from "../../assets/auth/cancel.svg";
import { useNavigate } from "react-router-dom";

interface WorkspaceItemProps {
  children: React.ReactNode;
  title: string;
  href: string;
  subtitle?: string;
}

const WorkspaceItemDetailsLayout = ({
  children,
  title,
  href,
  subtitle,
}: WorkspaceItemProps) => {
  const navigate = useNavigate();
  return (
    <WorkspaceItemContainer>
      <Request>
        <RequestHeader>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <img onClick={() => navigate(href)} src={cancel} alt="" />
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
  height: 85vh;
`;
export const Request = styled.div`
  width: 757px;
  outline: 1px solid gray;
`;
export const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  height: 98px;
  background: var(--bg-secondary);
  padding: 22px 26px;

  h1 {
    font-size: 30px;
    font-weight: 500;
  }
  img {
    width: 20px;
    cursor: pointer;
  }
`;
