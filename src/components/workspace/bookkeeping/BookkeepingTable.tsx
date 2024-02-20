import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { useBookkeeping } from "../../../store/useBookkeeping";
import {
  Logo,
  SafeSection,
} from "../../../pages/workspace/bookkeeping/BookkeepingTransferDetails";
import { getShortAddress } from "../../../utils";
import { useWorkspace } from "../../../store/useWorkspace";
import rightArrow from "../../../assets/workspace/right-arrow.svg";
import { formatNumber } from "../../../utils/number";
import { CategoryCell } from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import { formatDate } from "../../../utils/time";

interface BookkeepingTableProps {
  selected: number[];
  setSelected: (selected: any) => void;
  filterData: IBookkeeping[];
  handleBookkeepingDetails: (bookkeeping: IBookkeeping) => void;
}

const BookkeepingTable = ({
  selected,
  setSelected,
  filterData,
  handleBookkeepingDetails,
}: BookkeepingTableProps) => {
  const { bookkeepingList } = useBookkeeping();
  const { workspace } = useWorkspace();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(bookkeepingList.map((c) => c.ID));
    } else {
      setSelected([]);
    }
  };

  const isSelected = (categoryId: number) => {
    return selected.indexOf(categoryId) !== -1;
  };

  const handleCheckboxClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    categoryId: number
  ) => {
    if (event.target.checked) {
      setSelected([...selected, categoryId]);
    } else {
      setSelected(selected.filter((id) => id !== categoryId));
    }
  };

  return (
    <TableContainer
      sx={{
        border: "1px solid var(--border)",
        borderRadius: "10px",
        maxHeight: "100%",
        overflow: "auto",
      }}
    >
      <Table stickyHeader>
        <TableHead style={{ backgroundColor: "#f0f0f0" }}>
          <TableRow>
            <TableCell sx={{ background: "var(--bg-primary)" }}>
              <Checkbox
                indeterminate={
                  selected.length > 0 &&
                  selected.length < bookkeepingList.length
                }
                checked={selected.length === bookkeepingList.length}
                onChange={handleSelectAllClick}
              />
              Safe
            </TableCell>
            <TableCell sx={{ background: "var(--bg-primary)" }}>
              Counterparty
            </TableCell>
            <TableCell sx={{ background: "var(--bg-primary)" }}>
              Amount
            </TableCell>
            <TableCell sx={{ background: "var(--bg-primary)" }}>
              Category
            </TableCell>
            <TableCell sx={{ background: "var(--bg-primary)" }}>Date</TableCell>
            <TableCell sx={{ background: "var(--bg-primary)" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData.map((bookkeeping) => (
            <React.Fragment key={bookkeeping.ID}>
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
                        checked={isSelected(bookkeeping.ID)}
                        onChange={(event) =>
                          handleCheckboxClick(event, bookkeeping.ID)
                        }
                      />
                      {getShortAddress(workspace?.vault_wallet)}
                    </div>
                    <Logo>
                      <img src={rightArrow} alt="" />
                    </Logo>
                  </SafeSection>
                </TableCell>
                <TableCell>{getShortAddress(bookkeeping.recipient)}</TableCell>
                <TableCell>
                  {formatNumber(Number(bookkeeping.amount))}{" "}
                  {bookkeeping.currency_name}
                </TableCell>
                <TableCell>
                  <CategoryCell>{bookkeeping.category_name}</CategoryCell>
                </TableCell>
                <TableCell>{formatDate(bookkeeping.CreatedAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "black",
                      color: "black",
                      textTransform: "lowercase",
                    }}
                    onClick={() => handleBookkeepingDetails(bookkeeping)}
                  >
                    view more
                  </Button>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookkeepingTable;
