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
  padding: 6px 8px;
  display: flex;
  justify-content: ${({ hideSidebar }) => (hideSidebar ? "center" : "start")};
  margin-bottom: 10px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--clr-gray-700);
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 6px;
  height: 40px;
  img {
    width: 14px;
  }
  &:hover {
    background-color: var(--clr-gray-100);
  }
  &.active {
    background-color: var(--clr-gray-100);
  }
`;
