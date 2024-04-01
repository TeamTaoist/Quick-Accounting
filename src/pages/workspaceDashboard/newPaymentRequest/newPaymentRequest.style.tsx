import styled from "@emotion/styled";

export const FullScreenDialog = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  background-color: var(--clr-modal-mask);
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const CreateRequest = styled.div`
  background: #fff;
  width: 800px;
  height: 550px;
  /* height: 30vh; */
  z-index: 100;
  border-radius: 6px;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
export const RequestHeader = styled.div`
  height: 126px;
  background: var(--clr-gray-100);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: 40px;
  gap: 20px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;
export const Request = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* overflow: scroll; */
  /* position: relative; */
  /* max-height: 480px; */
  /* overflow-y: scroll; */
  margin-inline: 16px;
`;
export const HeaderTitle = styled.div`
  display: flex;
  justify-content: space-between;
  /* padding: 22px 26px; */

  h1 {
    font-size: 20px;
    font-weight: 600;
  }
  img {
    width: 20px;
    height: 20px;
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
    font-weight: 400;
    color: var(--clr-gray-500);
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
    font-size: 14px;
    font-weight: 500;
  }
  p {
    font-size: 12px;
    font-weight: 500;
    color: var(--clr-gray-500);
  }
`;

export const TableSection = styled.div`
  margin-inline: 20px;
  margin-top: 20px;
  /* padding-top: 150px; */
  margin-bottom: 30px;
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
export const AddPayment = styled.div`
  border-top: 1px solid var(--clr-gray-200);
  display: flex;
  justify-content: center;
  button {
    background: transparent;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 0;
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
  align-items: center;
  padding: 10px 15px;
  background: var(--clr-gray-100);
  border-top: 1px solid var(--clr-gray-200);
  height: 56px;
  h3 {
    font-size: 14px;
    font-weight: 500;
    color: #475569;
  }
  .note {
    padding-bottom: 8px;
  }
`;
export const Image = styled.img`
  width: 16px;
  height: 16px;
`;
export const NoteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
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
  background: var(--clr-primary-900);
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  width: 100%;
  height: 40px;
  border-radius: 6px;
  margin-top: 30px;
  cursor: pointer;
  color: var(--clr-white);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 14px;
  }
`;
export const PaymentRequestInput = styled.input`
  border: 1px solid var(--clr-gray-200);
  outline: none;
  padding: 10px 14px;
  border-radius: 6px;
  margin: 4px 0;
  height: 40px;
  width: 100%;
  font-size: 14px;
  color: var(--clr-primary-900);
  &::placeholder {
    opacity: 0.5;
  }
`;
export const PaymentRequestDateInput = styled.input<any>`
  border: 1px solid var(--clr-gray-200);
  outline: none;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 14px;
  margin: 4px 0;
  height: 40px;
  width: 100%;
  color: ${(props) => (props.isActive ? "var(--clr-primary-900)" : "gray")};
  &::placeholder {
    opacity: 0.5;
  }
`;
