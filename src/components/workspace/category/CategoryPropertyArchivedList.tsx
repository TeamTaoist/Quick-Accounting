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
  };
  // useEffect(() => {
  //   if (categoryId !== undefined) {
  //     getCategoryPropertyByCategoryId(workspaceId, categoryId, true);
  //   }
  // }, [categoryId, getCategoryPropertyByCategoryId, workspaceId]);
  console.log(archivedCategoryProperty);
  console.log(categoryId);

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
                sx={{ border: "1px solid var(--border)", borderRadius: "10px" }}
              >
                <Table>
                  <TableHead
                    style={{
                      background: "var(--bg-secondary)",
                    }}
                  >
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < archivedCategoryProperty.length
                          }
                          checked={
                            selected.length === archivedCategoryProperty.length
                          }
                          onChange={handleSelectAllClick}
                        />
                        Category
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {archivedCategoryProperty.map((category) => (
                      <TableRow key={category.ID}>
                        <TableCell
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Checkbox
                            checked={isSelected(category.ID)}
                            onChange={(event) =>
                              handleCheckboxClick(event, category.ID)
                            }
                          />
                          <CellValue>{category.name}</CellValue>
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
  margin-top: 20px;

  div {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 10px;
    border-radius: 5px;
    background: var(--bg-primary);
    font-size: 20px;
    cursor: pointer;
    img {
      width: 20px;
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
