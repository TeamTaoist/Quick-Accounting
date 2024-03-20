import styled from "@emotion/styled";

export const PaymentRequestContainer = styled.div`
  /* padding-top: 3%;
  margin-inline: 40px; */
  /* height: 90vh; */
  padding: 40px;
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 1100px;
`;
export const Filter = styled.div`
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
`;
export const PaymentRequestBody = styled.div``;
export const ActionBtn = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  margin: 20px 0;
  margin-left: 20px;
  /* margin-top: 60px; */
  img {
    width: 20px;
  }
`;
export const Btn = styled.div`
  display: flex;
  gap: 8px;
  border: 1px solid var(--clr-gray-300);
  padding: 8px 10px;
  border-radius: 5px;
  p {
    font-size: 14px;
    font-weight: 500;
  }
  cursor: pointer;
`;
export const Image = styled.img`
  width: 20px;
`;
export const Option = styled.div`
  display: flex;
  gap: 5px;
`;
export const ViewReject = styled.div`
  div {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--clr-gray-50);
    padding: 8px 12px;
    border-radius: 6px;
    p {
      font-size: 14px;
      font-weight: 600;
    }
  }
`;
export const RejectSection = styled.div`
  /* margin-top: 20px; */
`;
export const BookkeepingRejectSection = styled.div`
  /* margin-top: 8px; */
`;
export const TableSection = styled.div`
  height: 100%;
  height: 70vh;
  width: 100%;
`;
export const PaymentPagination = styled.div`
  padding: 20px 0;
`;
export const CategoryCell = styled.div`
  background: var(--clr-gray-200);
  padding: 6px;
  font-size: 14px;
  text-align: center;
  border-radius: 5px;
`;
