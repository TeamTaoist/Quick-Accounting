import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { SidebarProps } from "./workspaceSidebar/WorkspaceSidebar";

interface SidebarLinkProps {
  to: string;
  name: string;
  icon: any;
  hideSidebar: boolean;
}

const SidebarLink = ({ to, name, icon, hideSidebar }: SidebarLinkProps) => {
  return (
    <SidebarLinks to={to} hideSidebar={hideSidebar}>
      <img src={icon} alt="" />
      {!hideSidebar && name}
    </SidebarLinks>
  );
};

export default SidebarLink;

const SidebarLinks = styled(NavLink)<SidebarProps>`
  /* padding: ${({ hideSidebar }) =>
    hideSidebar ? "10px 0 10px 0" : "10px 0 10px 43px"}; */
  padding: 10px;
  display: flex;
  justify-content: ${({ hideSidebar }) => (hideSidebar ? "center" : "start")};
  margin-bottom: 10px;
  text-decoration: none;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  display: flex;
  gap: 13px;
  align-items: center;
  border-radius: 6px;
  img {
    width: 14px;
  }
  &:hover {
    background-color: var(--bg-primary);
  }
  &.active {
    background-color: #efefef;
  }
`;
