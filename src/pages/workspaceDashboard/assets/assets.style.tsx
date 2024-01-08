import styled from "@emotion/styled";

export const AssetSection = styled.div`
  padding-top: 110px;
  padding-left: 40px;
  /* height: 100vh; */
`;
export const AssetHeader = styled.div`
  margin-bottom: 40px;
`;
export const AssetTable = styled.div`
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::--webkit-scrollbar {
    display: none;
  }
  h3 {
    font-size: 20px;
    font-weight: 500;
    padding-bottom: 44px;
  }
`;

export const RowCell = styled.div`
  justify-content: center;
  display: grid;
  h6 {
    font-size: 20px;
    font-weight: 400;
  }
  p {
    font-size: 13px;
  }
`;
export const RowLink = styled.div`
  img {
    width: 23px;
  }
`;
