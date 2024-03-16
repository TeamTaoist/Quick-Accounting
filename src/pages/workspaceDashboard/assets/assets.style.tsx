import styled from "@emotion/styled";

export const AssetSection = styled.div`
  padding: 30px;
`;
export const EmptyAsset = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 65vh;
  line-height: 32px;
  h3 {
    font-size: 24px;
    font-weight: 600;
  }
  p {
    font-size: 14px;
    color: var(--clr-gray-700);
  }
  button {
    border: 1px solid var(--clr-gray-300);
    outline: none;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    margin-top: 14px;

    img {
      width: 16px;
    }
  }
`;
export const AssetHeader = styled.div`
  /* margin-bottom: 40px; */
`;
export const AssetValue = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
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
  /* display: grid; */
  h6 {
    font-size: 20px;
    font-weight: 400;
  }
  p {
    font-size: 13px;
    color: var(--text-secondary);
  }
`;
export const RowLink = styled.div`
  img {
    width: 23px;
  }
`;
