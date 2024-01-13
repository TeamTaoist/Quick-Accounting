import styled from "@emotion/styled";

export const WorkspaceContainer = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 85vh;
  padding-top: 90px;
`;
export const WorkspaceForm = styled.div`
  width: 530px;
  // padding-inline: 20px;

  h3 {
    font-size: 32px;
    font-weight: 500;
    padding-bottom: 15px;
  }
  p {
    font-size: 20px;
  }
`;

export const Safe = styled.div`
  padding: 40px 0;
`;
export const CreateSafe = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 40px 0 17px 0;
  p {
    font-size: 18px;
  }
  a {
    font-size: 16px;
    color: #2f82cf;
    text-decoration: none;
  }
`;
export const Button = styled.button`
  background: var(--bg-primary);
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  padding: 13px 0;
  width: 100%;
  border-radius: 7px;
  margin-top: 50px;
  cursor: pointer;
  color: var(--text-primary);
`;
