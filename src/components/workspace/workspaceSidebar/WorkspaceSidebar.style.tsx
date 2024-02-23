import styled from "@emotion/styled";
import { SidebarProps } from "./WorkspaceSidebar";

export const SidebarContainer = styled.div<SidebarProps>`
  border-right: 1px solid var(--border);
  /* max-width: 327px; */
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  width: ${({ hideSidebar }) => (hideSidebar ? "80px" : "327px")};
  transition: width 0.3s ease-in-out;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
export const WorkspaceInfo = styled.div<SidebarProps>`
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 19px 0 33px;
  border-bottom: 1px solid var(--border);
  height: 130px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;

  img {
    width: 14px;
    cursor: pointer;
    transform: ${({ hideSidebar }) => hideSidebar && "rotate(180deg)"};
  }
  h5 {
    font-size: 21px;
    font-weight: 500;
  }
  p {
    font-size: 16px;
  }
`;
export const PaymentRequest = styled.div`
  display: grid;
  justify-content: center;
  margin-top: 40px;
`;
export const RequestBtn = styled.button<SidebarProps>`
  border: none;
  outline: none;
  display: flex;
  justify-content: ${({ hideSidebar }) => (hideSidebar ? "center" : "start")};
  align-items: center;
  gap: 40px;
  padding: ${({ hideSidebar }) => (hideSidebar ? "10px" : "10px 40px")};
  border-radius: 5px;
  margin-bottom: 30px;
  cursor: pointer;
  width: ${({ hideSidebar }) => (hideSidebar ? "60px" : "230px")};

  img {
    width: ${({ hideSidebar }) => (hideSidebar ? "20px" : "24px")};
  }
  span {
    font-size: 20px;
  }
`;
export const SidebarLinkList = styled.div`
  padding-top: 20px;
`;
