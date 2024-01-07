import Header from "../../../components/layout/header/Header";
import WorkspaceItemLayout from "../../../components/layout/WorkspaceItemLayout";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import styled from "@emotion/styled";
import archive from "../../../assets/workspace/archive.svg";

interface Category {
  id: number;
  name: string;
}

const categories: Category[] = [
  { id: 1, name: "Category Name" },
  { id: 2, name: "Category 2" },
  { id: 3, name: "Category 3" },
];

const Archived = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(categories.map((category) => category.id));
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
  return (
    <Header>
      <WorkspaceItemLayout
        title="Archived categories"
        href="/category"
        subtitle="These categories will continue to be applied to historical transfers."
      >
        <Unarchive>
          <div>
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
                        selected.length < categories.length
                      }
                      checked={selected.length === categories.length}
                      onChange={handleSelectAllClick}
                    />
                    Category
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell sx={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        checked={isSelected(category.id)}
                        onChange={(event) =>
                          handleCheckboxClick(event, category.id)
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
      </WorkspaceItemLayout>
    </Header>
  );
};

export default Archived;

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
