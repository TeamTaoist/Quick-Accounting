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
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import { useParams } from "react-router-dom";
import { useCategory } from "../../../store/useCategory";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
import { checkboxClasses } from "@mui/material/Checkbox";

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
    <>
      <WorkspaceItemDetailsLayout
        title="Archived category properties"
        // subtitle="These categories will continue to be applied to historical transfers."
        setOpen={setOpen}
      >
        {archivedCategoryProperty.length === 0 ? (
          <Archivemsg>Archive list is empty</Archivemsg>
        ) : (
          <>
            <Unarchive>
              <div onClick={handleUnArchive}>
                <img src={archive} alt="" />
                <p>Unarchive</p>
              </div>
            </Unarchive>
            <ArchiveTable>
              <TableContainer
                sx={{
                  border: "1px solid var(--clr-gray-300)",
                  borderRadius: "10px",
                }}
              >
                <Table>
                  <TableHead
                    style={{
                      background: "var(--clr-gray-200)",
                    }}
                  >
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, padding: "5px 10px" }}>
                        <Checkbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < archivedCategoryProperty.length
                          }
                          checked={
                            selected.length === archivedCategoryProperty.length
                          }
                          onChange={handleSelectAllClick}
                          sx={{
                            marginRight: "30px",
                            [`&, &.${checkboxClasses.checked}`]: {
                              color: "#0f172a",
                            },
                            [`&, &.${checkboxClasses.indeterminate}`]: {
                              color: "#0f172a",
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: 30,
                              borderRadius: 6,
                            },
                          }}
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
                            padding: "5px 10px",
                            display: "flex",
                            alignItems: "center",
                            borderBottom:
                              i === archivedCategoryProperty.length - 1
                                ? "none"
                                : undefined,
                          }}
                        >
                          <Checkbox
                            checked={isSelected(property.ID)}
                            onChange={(event) =>
                              handleCheckboxClick(event, property.ID)
                            }
                            sx={{
                              marginRight: "30px",
                              [`&, &.${checkboxClasses.checked}`]: {
                                color: "#0f172a",
                              },
                              "& .MuiSvgIcon-root": {
                                fontSize: 30,
                                borderRadius: 6,
                              },
                            }}
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
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default CategoryPropertyArchivedList;

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
  padding: 30px;
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
