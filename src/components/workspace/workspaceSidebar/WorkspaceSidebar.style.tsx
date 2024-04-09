import styled from "@emotion/styled";
import { SidebarProps } from "./WorkspaceSidebar";

export const SidebarContainer = styled.div<SidebarProps>`
  border-right: 1px solid var(--clr-gray-200);
  /* max-width: 327px; */
  /* height: 100vh; */
  height: calc(100vh - 72px);
  overflow-y: auto;
  overflow-x: hidden;
  width: ${({ hideSidebar }) => (hideSidebar ? "88px" : "256px")};
  transition: width 0.3s ease-in-out;
  padding: 23.5px;
  /* padding-inline: 20px; */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
export const WorkspaceInfo = styled.div<SidebarProps>`
  display: flex;
  justify-content: ${({ hideSidebar }) => (hideSidebar ? "center" : "start")};
  gap: 12px;
  /* align-items: center; */
  background-color: ${({ hideSidebar }) =>
    hideSidebar ? "white" : "var(--clr-gray-100)"};
  padding: ${({ hideSidebar }) =>
    hideSidebar ? "0" : "12px"};
  border-radius: 6px;
  height: ${({ hideSidebar }) => (hideSidebar ? "" : "80")};

  h5 {
    font-size: 14px;
    font-weight: 500;
  }
`;
export const ArrowImg = styled.img<SidebarProps>`
  width: 16px;
  height: 16px;
  cursor: pointer;
  transform: ${({ hideSidebar }) => hideSidebar && "rotate(180deg)"};
  /* margin-top: 2px; */
`;

export const SafeAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 0;
  border-radius: 3px;
  font-size: 12px;
  color: var(--clr-gray-400);
  font-weight: 400;
  img {
    width: 12px;
    height: 12px;
  }
`;
export const PaymentRequest = styled.div`
  margin-top: 20px;
  width: 100%;
`;
export const RequestBtn = styled.button<SidebarProps>`
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ hideSidebar }) => (hideSidebar ? "10px" : "10px")};
  border-radius: 5px;
  margin: 1rem 0;
  cursor: pointer;
  width: 100%;
  height: 40px;
  font-family: "Inter";
  &:first-child {
    color: var(--clr-white);
    background: var(--clr-primary-900);
    border: none;
  }
  background: transparent;
  border: 1px solid var(--clr-gray-200);
  img {
    width: 16px;
    height: 16px;
  }
  span {
    font-size: 14px;
    font-weight: 500;
  }
`;
export const SidebarLinkList = styled.div`
  padding-top: 12px;
`;
