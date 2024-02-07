import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

const SidebarLink = ({ to, name, icon }: any) => {
  return (
    <SidebarLinks to={to}>
      <img src={icon} alt="" />
      {name}
    </SidebarLinks>
  );
};

export default SidebarLink;

const SidebarLinks = styled(NavLink)`
  padding: 10px 0 10px 43px;
  margin-bottom: 10px;
  text-decoration: none;
  font-size: 20px;
  color: #000;
  cursor: pointer;
  display: flex;
  gap: 13px;
  align-items: center;
  img {
    width: 20px;
  }
  &:hover {
    background-color: var(--bg-primary);
  }
  &.active {
    background-color: #efefef;
  }
`;
