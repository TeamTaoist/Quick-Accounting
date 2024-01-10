import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
} from "@mui/material";
import data from "../../data/tableData";
import { useNavigate } from "react-router-dom";
import {
  Logo,
  SafeSection,
} from "../../pages/workspace/bookkeeping/Bookkeeping";
import { useState } from "react";
import rightArrow from "../../assets/workspace/right-arrow.svg";
import hide from "../../assets/workspace/hide.svg";
import styled from "@emotion/styled";

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};
const BookkeepingRejectTable = () => {
  const navigate = useNavigate();
  // table logic
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map((c) => c.id));
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

  const isSelected = (categoryId: number) => {
    return selected.indexOf(categoryId) !== -1;
  };
  return (
    <div>
      <UnhideBtn>
        <Btn>
          <img src={hide} alt="" />
          <p>Unhide</p>
        </Btn>
      </UnhideBtn>
      <TableContainer
        sx={{ border: "1px solid var(--border)", borderRadius: "10px" }}
      >
        <Table>
          <TableHead style={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < data.length
                  }
                  checked={selected.length === data.length}
                  onChange={handleSelectAllClick}
                />
                Safe
              </TableCell>
              <TableCell>Counterparty</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((book) => (
              <>
                <TableRow>
                  <TableCell
                    style={{
                      padding: 0,
                      paddingLeft: "16px",
                      borderBottom: "1px solid #ddd",
                      borderTop: "none",
                    }}
                  >
                    <SafeSection>
                      <div>
                        <Checkbox
                          checked={isSelected(book.id)}
                          onChange={(event) =>
                            handleCheckboxClick(event, book.id)
                          }
                        />
                        {`${book.recipient.slice(
                          0,
                          6
                        )}...${book.recipient.slice(-4)}`}
                      </div>
                      <Logo>
                        <img src={rightArrow} alt="" />
                      </Logo>
                    </SafeSection>
                  </TableCell>
                  <TableCell>{`${book.recipient.slice(
                    0,
                    6
                  )}...${book.recipient.slice(-4)}`}</TableCell>
                  <TableCell>{book.amount}</TableCell>
                  <TableCell>
                    <CategoryCell>{book.category}</CategoryCell>
                  </TableCell>
                  <TableCell>{book.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "black",
                        color: "black",
                        textTransform: "lowercase",
                      }}
                      onClick={() => navigate(`/payment-request/${book.id}`)}
                    >
                      view more
                    </Button>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BookkeepingRejectTable;

const CategoryCell = styled.div`
  background: var(--bg-primary);
  padding: 4px;
  font-size: 14px;
  text-align: center;
  border-radius: 5px;
`;
const UnhideBtn = styled.div`
  display: flex;
  justify-content: end;
`;
export const Btn = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 8px;
  border: 1px solid var(--border);
  padding: 6px 10px;
  border-radius: 5px;
  border: 1px solid #111;
  img {
    width: 22px;
  }
  p {
    font-size: 20px;
  }
`;
