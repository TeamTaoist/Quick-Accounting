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
    await unArchiveCategory(workspaceId, categoryIds);
    setCategoryLoading(!categoryLoading);
    setSelected([]);
  };

  // get workspace un-archive category
  const archiveQuery = true;
  useEffect(() => {
    getWorkspaceCategories(workspaceId, archiveQuery);
  }, [getWorkspaceCategories, workspaceId, archiveQuery, categoryLoading]);
  console.log(selected);

  return (
    <>
      <WorkspaceItemDetailsLayout
        title="Archived categories"
        subtitle="These categories will continue to be applied to historical transfers."
        setOpen={setOpen}
      >
        <Unarchive>
          <div onClick={handleUnArchive}>
            <img src={archive} alt="" />
            <p>Unarchive</p>
          </div>
        </Unarchive>
        {workspaceCategories.data.total === 0 ? (
          <Archivemsg>Archive list is empty</Archivemsg>
        ) : (
          <>
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
                            selected.length <
                              workspaceCategories.data.rows.length
                          }
                          checked={
                            selected.length ===
                            workspaceCategories.data.rows.length
                          }
                          onChange={handleSelectAllClick}
                        />
                        Category
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workspaceCategories.data.rows.map((category) => (
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

export default CategoryArchivedList;

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
  padding: 50px;
`;
