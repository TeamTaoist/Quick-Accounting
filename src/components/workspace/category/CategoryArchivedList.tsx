import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import styled from "@emotion/styled";
import unarchive from "../../../assets/workspace/unarchive.svg";
import cancel from "../../../assets/auth/cancel.svg";
import { useParams } from "react-router-dom";
import { useCategory } from "../../../store/useCategory";
import { checkboxClasses } from "@mui/material/Checkbox";
import { CreateBtn } from "../../../pages/workspace/category/category.style";
import Button from "../../button";

export const CheckBoxStyle = {
  marginRight: "25px",
  overflow: "hidden",
  [`&, &.${checkboxClasses.colorPrimary}`]: {
    color: "#cbd5e1",
  },
  [`&, &.${checkboxClasses.checked}`]: {
    color: "#0f172a",
  },
  [`&, &.${checkboxClasses.indeterminate}`]: {
    color: "#0f172a",
  },
  "& .MuiSvgIcon-root": {
    // fontSize: 30,
    borderRadius: 6,
    // backgroundColor: "#fff",
    // overflow: "hidden",
  },
};

const CategoryArchivedList = ({ setOpen }: any) => {
  const { id } = useParams();
  const [selected, setSelected] = useState<number[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);

  const { getWorkspaceCategories, workspaceCategories, unArchiveCategory } =
    useCategory();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(workspaceCategories.data.rows.map((category) => category.ID));
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    categoryId: number
  ) => {
    if (event.target.checked) {
      setSelected((prevSelected) => [...prevSelected, categoryId]);
    } else {
      setSelected((prevSelected) =>
        prevSelected.filter((id) => id !== categoryId)
      );
    }
  };

  const isSelected = (categoryId: number) =>
    selected.indexOf(categoryId) !== -1;

  // un archive category
  const workspaceId = Number(id);
  const categoryIds = selected;
  const handleUnArchive = async () => {
    if (selected.length) {
      await unArchiveCategory(workspaceId, categoryIds);
      setCategoryLoading(!categoryLoading);
      setSelected([]);
    }
  };

  // get workspace un-archive category
  const archiveQuery = true;
  useEffect(() => {
    getWorkspaceCategories(workspaceId, archiveQuery);
  }, [getWorkspaceCategories, workspaceId, archiveQuery, categoryLoading]);
  console.log(selected);

  return (
    <ArchivedContainer>
      <ArchivedList>
        <Header>
          <div>
            <HeaderTitle>
              <h1>Archived categories</h1>
              <img onClick={() => setOpen(false)} src={cancel} alt="" />
            </HeaderTitle>
            <p>
              These categories will continue to be applied to historical
              transfers.
            </p>
          </div>
        </Header>
        {workspaceCategories.data.total === 0 ? (
          <Archivemsg>Archive list is empty</Archivemsg>
        ) : (
          <>
            <Unarchive>
              <Button onClick={handleUnArchive} icon={unarchive}>
                Unarchive
              </Button>
            </Unarchive>
            <ArchiveTable>
              <TableContainer
                sx={{
                  boxShadow: "none",
                  border: "1px solid var(--clr-gray-200)",
                  borderRadius: "6px",
                  maxHeight: "100%",
                  overflow: "auto",
                  width: "100%",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  "-ms-overflow-style": "none",
                  scrollbarWidth: "none",
                }}
              >
                <Table>
                  <TableHead
                    style={{
                      background: "var(--clr-gray-200)",
                    }}
                  >
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontSize: "14px",
                          padding: "0 10px",
                          height: "56px",
                        }}
                      >
                        <Checkbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length <
                              workspaceCategories.data.rows.length
                          }
                          checked={
                            selected.length ===
                            workspaceCategories.data.rows.length
                          }
                          onChange={handleSelectAllClick}
                          sx={CheckBoxStyle}
                        />
                        Category
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workspaceCategories.data.rows.map((category, i) => (
                      <TableRow key={category.ID}>
                        <TableCell
                          sx={{
                            padding: "0 10px",
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "none",
                            borderTop: "1px solid var(--clr-gray-200)",
                            height: "56px",
                          }}
                        >
                          <Checkbox
                            checked={isSelected(category.ID)}
                            onChange={(event) =>
                              handleCheckboxClick(event, category.ID)
                            }
                            sx={CheckBoxStyle}
                          />
                          {category.name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </ArchiveTable>
          </>
        )}
      </ArchivedList>
      {/* </WorkspaceItemDetailsLayout> */}
    </ArchivedContainer>
  );
};

export default CategoryArchivedList;
const ArchivedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;
const ArchivedList = styled.div`
  width: 800px;
  height: 480px;
  border: 1px solid var(--border-table);
  border-radius: 10px;
  overflow: scroll;
  background: #fff;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: grid;
  align-items: center;
  height: 126px;
  background: var(--clr-gray-100);
  padding-inline: 40px;
  gap: 20px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  p {
    font-size: 14px;
    font-weight: 500;
    margin-top: 16px;
  }
`;
const HeaderTitle = styled.div`
  display: flex;
  justify-content: space-between;
  /* padding: 22px 26px; */

  h1 {
    font-size: 24px;
    font-weight: 600;
  }
  img {
    width: 16px;
    cursor: pointer;
  }
`;
const Unarchive = styled.div`
  display: flex;
  justify-content: end;
  padding-right: 30px;
  margin-top: 30px;
`;
const ArchiveTable = styled.div`
  padding: 22px 30px;
`;
const Archivemsg = styled.div`
  font-size: 20px;
  text-align: center;
  padding: 100px;
`;
