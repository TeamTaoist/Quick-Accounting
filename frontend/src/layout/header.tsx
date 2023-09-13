import styled from "@emotion/styled";

export default function Header() {
  return <HeaderStyle>
    <nav>
      <h1>Quick Accounting</h1>
    </nav>
  </HeaderStyle>;
}

const HeaderStyle = styled.header`
  height: 80px;
  background-color: #fff;
  padding-inline: 40px;
  line-height: 80px;
  h1 {
    margin: 0;
  }
`