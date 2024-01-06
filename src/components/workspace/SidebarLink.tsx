import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const SidebarLink = ({ to, name, handleLink, activeLink, icon }: any) => {
  return (
    <SidebarList
      className={`${name === activeLink ? "active" : ""}`}
      onClick={() => handleLink(name)}
    >
      <Link to={to}>
        <SidebarLin className="link">
          <img src={icon} alt="" />
          {name}
        </SidebarLin>
      </Link>
    </SidebarList>
  );
};

export default SidebarLink;

const SidebarList = styled.div`
  padding: 10px 0 10px 43px;
  margin-bottom: 10px;
  &:hover {
    background-color: var(--bg-primary);
  }
  &.active {
    background-color: #efefef;
  }
`;
const SidebarLin = styled.div`
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
`;
