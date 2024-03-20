import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
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
import details from "../../../assets/details.svg";
import { formatNumber } from "../../../utils/number";
import { CategoryCell } from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import { getPaymentUpdateTime } from "../../../utils/payment";
import { useDomainStore } from "../../../store/useDomain";

const HeaderStyles = {
  fontSize: "14px",
  fontWeight: "500",
  fontFamily: "Inter",
  color: "var(--clr-primary-900)",
  background: "var(--clr-gray-200)",
  padding: "0 16px",
};
interface BookkeepingTableProps {
  selected: number[];
  setSelected: (selected: any) => void;
  filterData: IPaymentRequest[];
  handleBookkeepingDetails: (bookkeeping: IPaymentRequest) => void;
}

const BookkeepingTable = ({
  selected,
  setSelected,
  filterData,
  handleBookkeepingDetails,
}: BookkeepingTableProps) => {
  const { bookkeepingList } = useBookkeeping();
  const { workspace } = useWorkspace();
  const { formatAddressToDomain } = useDomainStore();

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
        border: "1px solid var(--clr-gray-200)",
        borderRadius: "6px",
        maxHeight: "100%",
        overflow: "auto",
        minWidth: "1100px",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        scrollbarWidth: "none",
      }}
    >
      <Table stickyHeader>
        <TableHead
          style={{ background: "var(--clr-gray-200)", height: "55px" }}
        >
          <TableRow>
            <TableCell sx={HeaderStyles}>
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
            <TableCell sx={HeaderStyles}>Counterparty</TableCell>
            <TableCell
              sx={{
                width: "30%",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: "var(--clr-primary-900)",
                background: "var(--clr-gray-200)",
              }}
            >
              Amount
            </TableCell>
            <TableCell sx={HeaderStyles}>Category</TableCell>
            <TableCell sx={HeaderStyles}>Date</TableCell>
            <TableCell sx={HeaderStyles}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData.map((bookkeeping) => (
            <React.Fragment key={bookkeeping.ID}>
              <TableRow>
                <TableCell
                  style={{
                    padding: 0,
                    borderBottom: "none",
                    borderTop: "1px solid var(--clr-gray-200)",
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
                    <Logo $dir={bookkeeping.direction}>
                      <img src={rightArrow} alt="" />
                    </Logo>
                  </SafeSection>
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    borderTop: "1px solid var(--clr-gray-200)",
                  }}
                >
                  {formatAddressToDomain(
                    bookkeeping.counterparty,
                    workspace.chain_id,
                    workspace.name_service === "sns"
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    borderTop: "1px solid var(--clr-gray-200)",
                  }}
                >
                  {formatNumber(Number(bookkeeping.amount))}{" "}
                  {bookkeeping.currency_name}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    borderTop: "1px solid var(--clr-gray-200)",
                  }}
                >
                  <CategoryCell>{bookkeeping.category_name}</CategoryCell>
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    borderTop: "1px solid var(--clr-gray-200)",
                  }}
                >
                  {getPaymentUpdateTime(bookkeeping)}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    borderTop: "1px solid var(--clr-gray-200)",
                  }}
                >
                  <Tooltip
                    title="View details"
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          background: "var(--clr-white)",
                          color: "#111",
                          border: "1px solid var(--clr-gray-200)",
                          padding: "8px 16px",
                          fontSize: "12px",
                        },
                      },
                    }}
                  >
                    <img
                      src={details}
                      alt=""
                      style={{ width: "16px" }}
                      onClick={() => handleBookkeepingDetails(bookkeeping)}
                    />
                  </Tooltip>
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
