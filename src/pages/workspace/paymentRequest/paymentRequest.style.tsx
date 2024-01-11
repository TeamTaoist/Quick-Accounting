import styled from "@emotion/styled";

export const PaymentRequestContainer = styled.div`
  padding-top: 30px;
  margin-inline: 40px;
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 940px;
`;
export const PaymentRequestBody = styled.div``;
export const ActionBtn = styled.div`
  display: flex;
  justify-content: end;
  gap: 20px;
  width: 100%;
  margin: 20px 0;
  margin-top: 60px;
  img {
    width: 20px;
  }
`;
export const Btn = styled.div`
  display: flex;
  gap: 8px;
  border: 1px solid var(--border);
  padding: 6px 10px;
  border-radius: 5px;
  p {
    font-size: 20px;
  }
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
    gap: 5px;
    background: var(--bg-primary);
    padding: 6px 10px;
    border-radius: 5px;
    p {
      font-size: 20px;
    }
  }
`;
export const RejectSection = styled.div`
  margin-top: 120px;
`;
export const CategoryCell = styled.div`
  background: var(--bg-primary);
  padding: 4px;
  font-size: 14px;
  text-align: center;
  border-radius: 5px;
`;
