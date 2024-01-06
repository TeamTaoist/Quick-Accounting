import styled from "@emotion/styled";

export const CreateRequest = styled.table`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 85vh;
`;
export const Request = styled.div`
  width: 757px;
  outline: 1px solid gray;
  height: 500px;
  /* padding-inline: 26px; */
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
export const Table = styled.table`
  /* width: 757px; */
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
  padding-inline: 46px;
  padding-top: 21px;
`;
