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
import checkedActiveIcon from "../../../assets/checkbox-active.svg";
import checkboxIcon from "../../../assets/checkbox.svg";
import checkboxIndeterminate from "../../../assets/checkbox-select.svg";
import { formatNumber } from "../../../utils/number";
import { CategoryCell } from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import { getPaymentUpdateTime } from "../../../utils/payment";
import { useDomainStore } from "../../../store/useDomain";
import { Cell, HeaderCell, TableContainerSection } from "../../table";
import { CheckBoxStyle } from "../category/CategoryArchivedList";

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
    <TableContainerSection>
      <Table stickyHeader>
        <TableHead
          style={{ background: "var(--clr-gray-200)", height: "55px" }}
        >
          <TableRow>
            <HeaderCell width="230px">
              <Checkbox
                indeterminate={
                  selected.length > 0 &&
                  selected.length < bookkeepingList.length
                }
                checked={selected.length === bookkeepingList.length}
                onChange={handleSelectAllClick}
                sx={CheckBoxStyle}
                checkedIcon={<img src={checkedActiveIcon} alt="" />}
                icon={<img src={checkboxIcon} alt="" />}
                indeterminateIcon={<img src={checkboxIndeterminate} alt="" />}
              />
              Safe
            </HeaderCell>
            <HeaderCell width="154px">Counterparty</HeaderCell>
            <HeaderCell width="290px">Amount</HeaderCell>
            <HeaderCell width="180px">Category</HeaderCell>
            <HeaderCell width="176px">Date</HeaderCell>
            <HeaderCell width="96px"></HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData.map((bookkeeping) => (
            <React.Fragment key={bookkeeping.ID}>
              <TableRow sx={{ height: "56px" }}>
                <Cell>
                  <SafeSection>
                    <div>
                      <Checkbox
                        checked={isSelected(bookkeeping.ID)}
                        onChange={(event) =>
                          handleCheckboxClick(event, bookkeeping.ID)
                        }
                        sx={CheckBoxStyle}
                        checkedIcon={<img src={checkedActiveIcon} alt="" />}
                        icon={<img src={checkboxIcon} alt="" />}
                      />
                      {getShortAddress(workspace?.vault_wallet)}
                    </div>
                    <Logo $dir={bookkeeping.direction}>
                      <img src={rightArrow} alt="" />
                    </Logo>
                  </SafeSection>
                </Cell>
                <Cell>
                  {formatAddressToDomain(
                    bookkeeping.counterparty,
                    workspace.chain_id,
                    workspace.name_service === "sns"
                  )}
                </Cell>
                <Cell>
                  {formatNumber(Number(bookkeeping.amount))}{" "}
                  {bookkeeping.currency_name}
                </Cell>
                <Cell>
                  <CategoryCell>
                    <p>{bookkeeping.category_name}</p>
                  </CategoryCell>
                </Cell>
                <Cell>{getPaymentUpdateTime(bookkeeping)}</Cell>
                <Cell>
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
                </Cell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainerSection>
  );
};

export default BookkeepingTable;
