import styled from "@emotion/styled";
import Header from "../../../components/layout/header/Header";

export const FullScreenDialog = styled(Header)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  background-color: #fff;
`;

export const CreateRequest = styled.table`
  display: grid;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;
export const Request = styled.div`
  margin-top: 92px;
  width: 750px;
  /* min-width: 750px; */
  border: 1px solid var(--border-table);
  padding-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const RequestHeader = styled.div`
  height: 150px;
  background: var(--clr-gray-100);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: 40px;
  gap: 20px;
`;
export const HeaderTitle = styled.div`
  display: flex;
  justify-content: space-between;
  /* padding: 22px 26px; */

  h1 {
    font-size: 24px;
    font-weight: 600;
  }
  img {
    width: 20px;
    cursor: pointer;
  }
`;
export const WorkspaceInfo = styled.div`
  display: flex;
  gap: 7px;
  justify-content: space-between;
  /* align-items: flex-end; */
`;
export const WorkspaceItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
export const UpdateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 11px;
  img {
    width: 16px;
  }
  p {
    font-size: 12px;
    color: #64748b;
  }
`;
export const WorkspaceLogo = styled.div`
  /* margin-top: 20px; */
  padding: 14px 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--clr-gray-200);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
  }
`;
export const WorkspaceDetails = styled.div`
  line-height: 18px;
  h6 {
    font-size: 12px;
    font-weight: 500;
  }
  p {
    font-size: 12px;
    font-weight: 500;
    color: var(--clr-gray-500);
  }
`;

export const TableSection = styled.table`
  /* padding-inline: 10px; */
  margin: 20px;
  /* max-width: 500px; */
`;

export const DeleteIcon = styled.div`
  display: grid;
  justify-content: center;
  /* margin-left: 40px; */
  img {
    width: 20px;
    cursor: pointer;
  }
`;
export const AddPayment = styled.button`
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 0;
  width: 96%;
  border-radius: 4px;
  margin: 8px 0;
  /* margin-top: 21px; */
  margin-inline: 2%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 10px;
  }
`;

export const NoteInformation = styled.div`
  /* padding-top: 30px; */
  /* padding-inline: 40px; */
  /* padding-bottom: 14px; */
`;
export const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: var(--clr-gray-200);
  h3 {
    font-size: 16px;
    font-weight: 600;
  }
  .note {
    padding-bottom: 8px;
  }
`;
export const Image = styled.img`
  width: 16px;
`;
export const NoteInfo = styled.div`
  display: flex;
  gap: 6px;
  input {
    /* border: 1px solid var(-clr-gray-200); */
    outline: none;
  }
`;
export const Btn = styled.div`
  /* padding-inline: 40px; */
  /* width: 680px;
  margin: 0 auto; */
`;
export const RequestSubmit = styled.button`
  background: var(--bg-primary);
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  padding: 10px 0;
  width: 100%;
  border-radius: 4px;
  margin-top: 21px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 10px;
  }
`;
export const PaymentRequestInput = styled.input`
  border: 1px solid var(--clr-gray-200);
  outline: none;
  padding: 10px 12px;
  border-radius: 6px;
  margin: 4px 0;
  height: 40px;
  width: 100%;
  &::placeholder {
    opacity: 0.5;
  }
`;
