import styled from "@emotion/styled";
import { useAppContext } from "../provider/appProvider";

export default function Header() {
  const { state: {account} } = useAppContext();
  return (
    <HeaderStyle>
      <nav>
        <h1>Quick Accounting</h1>
        {account && <span>{account}</span>}
      </nav>
    </HeaderStyle>
  );
}

const HeaderStyle = styled.header`
  height: 80px;
  background-color: #fff;
  padding-inline: 40px;
  line-height: 80px;
  h1 {
    margin: 0;
  }
  nav {
    display: flex;
    justify-content: space-between;
  }
`;
