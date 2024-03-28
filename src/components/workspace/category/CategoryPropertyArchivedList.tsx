import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import styled from "@emotion/styled";
import archive from "../../../assets/workspace/archive.svg";
import cancel from "../../../assets/auth/cancel.svg";
import { useParams } from "react-router-dom";
import { useCategory } from "../../../store/useCategory";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
import { checkboxClasses } from "@mui/material/Checkbox";
import { CheckBoxStyle } from "./CategoryArchivedList";
import Button from "../../button";

interface CategoryPropertyArchivedListProps {
  setOpen: (open: boolean) => void;
  categoryId?: number;
}

const CategoryPropertyArchivedList = ({
  setOpen,
  categoryId,
}: CategoryPropertyArchivedListProps) => {
  const { id } = useParams();
  const [selected, setSelected] = useState<number[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);

  const {
    archivedCategoryProperty,
    unArchiveCategoryProperties,
    getCategoryPropertyByCategoryId,
    getWorkspaceCategoryProperties,
  } = useCategoryProperty();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(archivedCategoryProperty.map((category) => category.ID));
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
      unArchiveCategoryProperties(workspaceId, categoryId, categoryIds).then(
        (res) => {
          if (res) {
            if (categoryId !== undefined) {
              getCategoryPropertyByCategoryId(workspaceId, categoryId, true);
            }
            getWorkspaceCategoryProperties(workspaceId);
            setSelected([]);
          }
        }
      );
    }
  };

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

        {archivedCategoryProperty.length === 0 ? (
          <Archivemsg>Archive list is empty</Archivemsg>
        ) : (
          <>
            <Unarchive>
              <Button onClick={handleUnArchive} icon={archive}>
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
                      background: "var(--clr-gray-100)",
                    }}
                  >
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontSize: "14px",
                          padding: "0 10px",
                          height: "56px",
                          borderBottom: "none",
                        }}
                      >
                        <Checkbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < archivedCategoryProperty.length
                          }
                          checked={
                            selected.length === archivedCategoryProperty.length
                          }
                          onChange={handleSelectAllClick}
                          sx={CheckBoxStyle}
                        />
                        Properties
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {archivedCategoryProperty.map((property, i) => (
                      <TableRow key={property.ID}>
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
                            checked={isSelected(property.ID)}
                            onChange={(event) =>
                              handleCheckboxClick(event, property.ID)
                            }
                            sx={CheckBoxStyle}
                          />
                          {property.name}
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

export default CategoryPropertyArchivedList;

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

  div {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--clr-gray-300);
    padding: 8px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    img {
      width: 13px;
    }
  }
`;
const ArchiveTable = styled.div`
  padding: 22px 30px;
`;
const CellValue = styled.div`
  background: var(--bg-primary);
  padding: 5px 10px;
  border-radius: 4px;
`;
const Archivemsg = styled.div`
  font-size: 20px;
  text-align: center;
  padding: 100px;
`;
