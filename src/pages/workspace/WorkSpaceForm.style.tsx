import styled from "@emotion/styled";

export const WorkspaceContainer = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--clr-modal-mask);
`;
export const WorkspaceForm = styled.div`
  background: var(--clr-white);
  width: 720px;
  height: 432px;
  border-radius: 6px;
  overflow: hidden;
`;
export const FormHeader = styled.div`
  background: var(--clr-gray-100);
  height: 126px;
  padding: 36px;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      font-size: 24px;
      font-weight: 600;
    }
    img {
      width: 24px;
      cursor: pointer;
    }
  }
  p {
    font-size: 14px;
    font-weight: 500;
    color: var(--clr-gray-600);
    margin-top: 14px;
  }
`;

export const Safe = styled.div`
  padding: 32px 40px;
`;
export const CreateSafe = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 0 20px 0;
  p {
    font-size: 12px;
    font-weight: 400;
  }
  a {
    font-size: 12px;
    font-weight: 400;
    text-decoration: none;
    border-radius: 6px;
    color: var(--clr-primary-900);
    display: flex;
    align-items: center;
    gap: 5px;
    img {
      width: 16px;
    }
  }
`;
export const Button = styled.button`
  background: var(--clr-primary-900);
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  padding: 13px 0;
  width: 100%;
  border-radius: 7px;
  margin-top: 26px;
  cursor: pointer;
  color: var(--clr-white);
  &[disabled]:hover {
    cursor: not-allowed;
  }
`;

export const ChainMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  img {
    width: 16px;
  }
`;

export const SelectBox = styled.div`
  display: flex;
  gap: 12px;
`;
export const Item = styled.div`
  display: flex;
  align-items: center;
`;
