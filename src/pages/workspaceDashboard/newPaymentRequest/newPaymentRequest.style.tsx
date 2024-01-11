import styled from "@emotion/styled";

export const CreateRequest = styled.table`
  display: grid;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;
export const Request = styled.div`
  margin-top: 92px;
  width: 757px;
  border: 1px solid var(--border-table);
  padding-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
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
  }
`;
export const TableSection = styled.table`
  /* padding-inline: 40px; */
`;

export const DeleteIcon = styled.div`
  /* display: grid;
  justify-content: center; */
  margin-left: 40px;
  img {
    width: 40px;
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

export const NoteInformation = styled.div`
  padding-top: 21px;
  padding-inline: 40px;
  h3 {
    font-size: 18px;
    font-weight: 400;
    padding-bottom: 8px;
  }
`;
export const Image = styled.img`
  width: 16px;
`;
export const NoteInfo = styled.div`
  display: flex;
  gap: 6px;
`;
export const Btn = styled.div`
  padding-inline: 40px;
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
