import styled from "@emotion/styled";

export const AssetSection = styled.div`
  padding-top: 110px;
  padding-left: 40px;
  height: 100vh;
  overflow: hidden;
`;
export const AssetHeader = styled.div`
  margin-bottom: 40px;
`;
export const AssetTable = styled.div`
  /* padding: 44px 0;
  max-height: 400px; */
  width: 940px;
  overflow: hidden;
  overflow-y: scroll;
  height: 400px;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::--webkit-scrollbar {
    display: none;
  }
  h3 {
    font-size: 20px;
    font-weight: 500;
    padding-bottom: 44px;
  }
  table {
    overflow-y: scroll;
    min-height: 400px;
    /* display: block; */
    border-collapse: collapse;
    width: 100%;
    border: 1px solid var(--border);
    th {
      background: var(--bg-primary);
      padding: 20px;
      color: #545050;
      font-size: 18px;
      font-weight: 500;
      position: sticky;
      top: 0;
      z-index: 1;
      border-top: 1px solid gray;
    }

    tr > td {
      border-bottom: 1px solid var(--border);
      padding: 16px 0;
      font-size: 20px;
      /* width: 100%; */
    }
    img {
      width: 23px;
    }
  }
`;

export const RowCell = styled.div`
  justify-content: center;
  display: grid;
  h6 {
    font-size: 24px;
    font-weight: 400;
  }
  p {
    font-size: 13px;
  }
`;
