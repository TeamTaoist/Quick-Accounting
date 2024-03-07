import styled from "@emotion/styled";

export const CreateCategory = styled.div`
  padding-top: 30px;
  margin-left: 40px;
  min-width: 600px;
`;
export const CategoryTitle = styled.div`
  height: 90vh;
  /* border: 1px solid var(--border); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    font-size: 30px;
    font-weight: 500;
  }
  p {
    font-size: 18px;
    padding: 30px 0;
  }
`;
export const CreateOptionButton = styled.div`
  display: flex;
  gap: 50px;
  margin-bottom: 50px;
`;
export const CreateBtn = styled.button`
  background: var(--bg-primary);
  outline: none;
  border: none;
  font-size: 20px;
  font-weight: 400;
  padding: 10px 50px;
  border-radius: 4px;
  margin-top: 21px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 14px;
  }
`;
export const CategoryForm = styled.div`
  margin-right: 40px;
`;
export const CategoryOption = styled.div`
  min-width: 900px;
  margin: 20px 0;
`;
export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  input {
    border: 1px solid var(--border);
    outline: none;
    background-color: transparent;
    padding: 5px 10px;
    border-radius: 7px;
  }
`;
export const HeaderOptions = styled.div`
  margin-right: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  div {
    display: flex;
    align-items: center;
    gap: 10px;
    img {
      width: 24px;
    }
    p {
      font-size: 18px;
    }
  }
`;
export const UpdateBtn = styled.button`
  border: none;
  outline: none;
  background: var(--bg-primary);
  padding: 8px 18px;
  border-radius: 7px;
  font-size: 18px;
  margin-right: 10px;
`;
export const UpdateLoadingBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--bg-primary);
  padding: 8px 18px;
  border-radius: 7px;
  font-size: 18px;
  margin-right: 10px;
`;
export const CategoryProperties = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 400px;
`;
export const Options = styled.div`
  display: flex;
  justify-content: space-between;

  h4 {
    font-size: 14px;
    font-weight: 500;
    padding-left: 10px;
    margin-top: 10px;
    color: #7c7777;
  }
`;
export const PropertyOptions = styled.div`
  border-right: 1px solid var(--border-table);
  width: 50%;
  height: 326px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 14px;
  &::-webkit-scrollbar {
    display: none;
  }
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
export const Option = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 12px;
  margin-top: 20px;
  background: var(--bg-primary);

  img {
    width: 24px;
  }
  p {
    font-size: 18px;
  }
`;
export const PropertyBtns = styled.div`
  display: flex;
  justify-content: space-between;
  /* border: 1px solid var(--border-table); */
`;
export const OptionCreateButtons = styled.div`
  border-right: 1px solid var(--border-table);
  /* display: flex;
  justify-content: space-evenly; */
  /* min-height: 80px; */
  width: 50%;
  button {
    display: flex;
    background: var(--bg-primary);
    gap: 7px;
    padding: 8px 20px;
    margin: 20px;
    margin-bottom: 20px;
    border: none;
    outline: none;
    border-radius: 10px;
    cursor: pointer;
    img {
      width: 16px;
    }
    span {
      font-size: 16px;
    }
  }
  /* button:first-child {
    border-right: 1px solid var(--border-table);
  } */
  /* button:first-of-type {
    border-right: 1px solid var(--border-table);
  } */
`;
export const PropertyTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  img {
    width: 20px;
  }
`;
export const Details = styled.div`
  width: 50%;
  height: 326px;
  overflow-y: auto;
  padding-bottom: 14px;
  &::-webkit-scrollbar {
    display: none;
  }
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
export const DetailsInput = styled.div`
  padding: 10px;
  h3 {
    font-size: 18px;
    font-weight: 400;
    padding: 10px 0;
  }
`;
export const PropertyInput = styled.input`
  padding: 10px;
  width: 100%;
`;
export const PropertyOptionsValue = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;

  img {
    width: 20px;
  }
`;
export const PropertyOptionsValueBtn = styled.button`
  border: none;
  outline: none;
  background: transparent;
  font-size: 18px;
  margin-left: 7px;
  cursor: pointer;
  margin-top: 16px;
`;

export const PropertyInputValue = styled.input`
  padding: 10px;
  width: 100%;
`;
export const DropdownOption = styled.div`
  display: flex;
  gap: 14px;
  img {
    width: 16px;
  }
`;
export const PropertyCreateButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  /* height: 60px;
  min-height: 80px; */
  width: 50%;
  padding: 0 20px;
`;
export const CreateCategoryBtn = styled.button`
  /* margin: 10px 40px; */
  padding: 8px 50px;
  background: var(--bg-primary);
  font-size: 18px;
  border: none;
  outline: none;
  border-radius: 10px;
  width: 100%;
  cursor: pointer;
`;
export const CancelBtn = styled.button`
  background: transparent;
  outline: none;
  border: 1px solid var(--border-table);
  font-size: 18px;
  padding: 8px 50px;
  border-radius: 10px;
  width: 100%;
  cursor: pointer;
`;
