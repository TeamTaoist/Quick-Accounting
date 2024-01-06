import styled from "@emotion/styled";

export const SidebarContainer = styled.div`
  border-right: 1px solid var(--border);
  width: 327px;
  height: 100vh;
  border: 1px solid red;
`;
export const WorkspaceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 19px 0 33px;
  border-bottom: 1px solid var(--border);
  height: 130px;
  img {
    width: 14px;
  }
  h5 {
    font-size: 21px;
    font-weight: 500;
  }
  p {
    font-size: 16px;
  }
`;
export const PaymentRequest = styled.div`
  display: grid;
  justify-content: center;
  margin-top: 70px;
`;
export const RequestBtn = styled.button`
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  gap: 40px;
  width: 235px;
  padding: 10px 40px;
  border-radius: 5px;
  margin-bottom: 30px;
  cursor: pointer;

  img {
    width: 24px;
  }
  span {
    font-size: 20px;
  }
`;
export const SidebarLinkList = styled.div`
  padding-top: 46px;
`;
