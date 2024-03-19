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
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import { useParams } from "react-router-dom";
import { useCategory } from "../../../store/useCategory";
import { checkboxClasses } from "@mui/material/Checkbox";

export const CheckBoxStyle = {
  marginRight: "30px",
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
    <>
      <WorkspaceItemDetailsLayout
        title="Archived categories"
        subtitle="These categories will continue to be applied to historical transfers."
        setOpen={setOpen}
      >
        {workspaceCategories.data.total === 0 ? (
          <Archivemsg>Archive list is empty</Archivemsg>
        ) : (
          <>
            <Unarchive>
              <div onClick={handleUnArchive}>
                <img src={unarchive} alt="" />
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
                            padding: "5px 10px",
                            display: "flex",
                            alignItems: "center",
                            borderBottom:
                              i === workspaceCategories.data.rows.length - 1
                                ? "none"
                                : undefined,
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
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default CategoryArchivedList;

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
const Archivemsg = styled.div`
  font-size: 20px;
  text-align: center;
  padding: 100px;
`;
