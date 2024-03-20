import styled from "@emotion/styled";

export const CreateCategory = styled.div`
  padding: 30px;
  min-width: 700px;
`;
export const CategoryTitle = styled.div`
  height: 65vh;
  /* border: 1px solid var(--border); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    font-size: 24px;
    font-weight: 600;
  }
  p {
    font-size: 14px;
    margin-top: 16px;
    margin-bottom: 30px;
    line-height: 20px;
  }
`;
export const CreateOptionButton = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-bottom: 24px;
`;
export const CreateBtn = styled.button<any>`
  background: ${(props) => props.bg || "transparent"};
  outline: none;
  border: 1px solid var(--clr-gray-300);
  padding: 12px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) => props.clr || "#0f172a"};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 14px;
  }
`;
export const CategoryForm = styled.div`
  /* margin-right: 40px; */
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
  color: var(--clr-primary-900);
  font-weight: 500;
  input {
    border: 1px solid var(--clr-gray-300);
    outline: none;
    background-color: var(--clr-white);
    padding: 12px 10px;
    border-radius: 6px;
    width: 310px;
  }
`;
export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
      width: 16px;
    }
    p {
      font-size: 14px;
      font-weight: 500;
    }
  }
`;
export const UpdateBtn = styled.button`
  border: none;
  outline: none;
  background: var(--clr-primary-900);
  color: var(--clr-white);
  padding: 10px 18px;
  border-radius: 7px;
  font-weight: 500;
  margin-right: 20px;
  margin-right: 10px;
  cursor: pointer;
  font-family: "Inter";
`;
export const UpdateLoadingBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding-inline: 18px;
  border-radius: 7px;
  font-size: 14px;
  margin-right: 10px;
  color: var(--clr-gray-400);
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
    padding: 16px;
    color: var(--clr-gray-500);
  }
`;
export const PropertyOptions = styled.div`
  border-right: 1px solid var(--clr-gray-200);
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
  margin-inline: 8px;
  border-radius: 6px;

  img {
    width: 16px;
  }
  p {
    font-size: 16px;
  }
`;
export const PropertyBtns = styled.div`
  display: flex;
  justify-content: space-between;
  /* border: 1px solid var(--border-table); */
`;
export const OptionCreateButtons = styled.div`
  width: 50%;
  border-right: 1px solid var(--clr-gray-200);

  button {
    display: flex;
    background: transparent;
    gap: 7px;
    padding: 10px 24px;
    margin: 20px;
    margin-bottom: 20px;
    border: 1px solid var(--clr-gray-400);
    outline: none;
    border-radius: 6px;
    cursor: pointer;
    img {
      width: 16px;
    }
    span {
      font-size: 14px;
      font-weight: 500;
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
  border: 1px solid var(--clr-gray-300);
  border-radius: 6px;
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
  border: 1px solid var(--clr-gray-300);
  outline: none;
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
  cursor: pointer;
  border: none;
  outline: none;
  background: var(--clr-white);
  border: 1px solid var(--clr-gray-200);
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  font-family: "Inter";
  margin-right: 20px;
  cursor: pointer;
`;
