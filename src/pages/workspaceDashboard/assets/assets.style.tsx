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
`;
export const EmptyAssetBtn = styled.button`
  border: none;
  outline: none;
  background: var(--clr-white);
  width: 165px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  margin-top: 14px;
  color: var(--clr-gray-600);
  font-family: "Inter";
  h6 {
    font-size: 12px;
    font-weight: 400;
  }
  img {
    width: 16px;
  }
`;
export const AssetHeader = styled.div`
  /* margin-bottom: 40px; */
`;
export const AssetValue = styled.h3`
  margin-top: 8px;
  margin-bottom: 18px;
  text-align: center;
  h3 {
    font-size: 24px;
    font-weight: 600;
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: var(--clr-gray-400);
    margin-top: 6px;
  }
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
    font-size: 14px;
    font-weight: 400;
  }
  p {
    font-size: 12px;
    color: var(--clr-gray-400);
  }
`;
export const RowLink = styled.div`
  img {
    width: 16px;
  }
`;
