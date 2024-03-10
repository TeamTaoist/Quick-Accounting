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
  display: flex;
  justify-content: space-between;
  height: 98px;
  background: var(--bg-primary);
  padding: 22px 26px;

  h1 {
    font-size: 30px;
    font-weight: 500;
  }
  img {
    width: 20px;
    cursor: pointer;
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
  }
`;
export const AddPayment = styled.button`
  background: transparent;
  border: 1px solid var(--border);
  border-style: dotted;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  padding: 10px 0;
  width: 96%;
  border-radius: 4px;
  margin-top: 21px;
  margin-inline: 2%;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
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
  background: var(--bg-secondary);
  h3 {
    font-size: 18px;
    font-weight: 400;
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
    border: none;
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
