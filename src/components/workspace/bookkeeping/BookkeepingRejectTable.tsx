import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Tooltip,
} from "@mui/material";
import {
  HideBtn,
  Logo,
  SafeSection,
} from "../../../pages/workspace/bookkeeping/Bookkeeping";
import { useEffect, useState } from "react";
import rightArrow from "../../../assets/workspace/right-arrow.svg";
import hide from "../../../assets/workspace/hide.svg";
import back from "../../../assets/workspace/back.svg";
import details from "../../../assets/details.svg";
import checkedActiveIcon from "../../../assets/checkbox-active.svg";
import checkboxIcon from "../../../assets/checkbox.svg";
import checkboxIndeterminate from "../../../assets/checkbox-select.svg";
import styled from "@emotion/styled";
import { useBookkeeping } from "../../../store/useBookkeeping";
import { getShortAddress } from "../../../utils";
import { useWorkspace } from "../../../store/useWorkspace";
import { formatNumber } from "../../../utils/number";
import {
  CategoryCell,
  Filter,
  Header,
  Image,
  PaymentPagination,
  TableSection,
  ViewReject,
} from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import Pagination from "../../Pagination";
import { useTranslation } from "react-i18next";
import { getPaymentUpdateTime } from "../../../utils/payment";
import { useDomainStore } from "../../../store/useDomain";
import SearchInput from "../SearchInput";
import FilterCategorySelect from "../FilterCategorySelect";
import { Cell, HeaderCell, TableContainerSection } from "../../table";
import Button from "../../button";
interface RejectTableProps {
  workspaceId: number;
  paymentRequest: boolean;
  handleBackBtn: () => void;
  handleBookkeepingDetails: (bookkeeping: IPaymentRequest) => void;
}
const BookkeepingRejectTable = ({
  workspaceId,
  paymentRequest,
  handleBackBtn,
  handleBookkeepingDetails,
}: RejectTableProps) => {
  const { t } = useTranslation();
  const { bookkeepingHiddenList, unHideBookkeepingList, getBookkeepingList } =
    useBookkeeping();
  const { workspace } = useWorkspace();
  const { formatAddressToDomain } = useDomainStore();

  // table logic
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(bookkeepingHiddenList.map((c) => c.ID));
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

  // pagination
  const [pageNumbers, setPageNumbers] = useState(0);
  const [totalItem, setTotalItem] = useState(0);

  const pageCount = Math.ceil(totalItem / 10);

  const handlePageClick = (event: any) => {
    setPageNumbers(event.selected);
  };

  useEffect(() => {
    getBookkeepingList(workspaceId, true, pageNumbers).then((res) => {
      if (res) {
        setTotalItem(res);
      }
    });
  }, [pageNumbers]);

  // filter table data
  // filter
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleDropdownChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  const filterData = bookkeepingHiddenList.filter((bookkeeping) => {
    const searchItem = bookkeeping.counterparty
      .toLowerCase()
      .includes(searchTerm?.toLowerCase() || "");
    const filterByCategory =
      selectedValue === "" || bookkeeping.category_name === selectedValue;
    return searchItem && filterByCategory;
  });
  // un-hide item
  const paymentRequestIds = selected.join(",");
  const handleUnHideBookkeepingList = async () => {
    await unHideBookkeepingList(workspaceId, paymentRequestIds);
    await getBookkeepingList(workspaceId, true);
  };
  console.log(selected);
  // unique category name
  const uniqueCategoryNames = Array.from(
    new Set(bookkeepingHiddenList.map((payment) => payment.category_name))
  );
  const handleSearchPayment = (e: any) => {
    // e.preventDefault();
    // getPaymentRequestList(workspaceId, false, pageNumbers, 10, searchTerm).then(
    //   (res) => {
    //     setTotalItem(res);
    //     setIsSearch(true);
    //   }
    // );
  };
  return (
    <div>
      {bookkeepingHiddenList.length === 0 && !paymentRequest && (
        <Message>
          <h3>You don't have any hidden transactions.</h3>
          <p style={{ width: "100%", textAlign: "center" }}>
            Transactions that add tokens to or remove tokens from your Safe will
            show up here.
          </p>
          <HideBtn onClick={handleBackBtn}>
            <img src={back} alt="" style={{ width: "20px" }} />
            <span>Back</span>
          </HideBtn>
        </Message>
      )}
      {bookkeepingHiddenList.length > 0 && (
        <Header>
          <Filter>
            <SearchInput
              handleSearchPayment={handleSearchPayment}
              placeholder="Search token"
              searchTerm={searchTerm}
              handleChange={handleChange}
              width="240px"
            />
            <FilterCategorySelect
              selectedValue={selectedValue}
              handleDropdownChange={handleDropdownChange}
              uniqueCategoryNames={uniqueCategoryNames}
            />
            <UnhideBtn>
              <Button
                icon={hide}
                width="104px"
                onClick={handleUnHideBookkeepingList}
              >
                <p>Unhide</p>
              </Button>
            </UnhideBtn>
          </Filter>
          <ViewReject>
            {bookkeepingHiddenList.length > 0 && !paymentRequest && (
              <Button icon={back} bg="#e2e8f0" onClick={handleBackBtn}>
                <p>{t("paymentRequest.Back")}</p>
              </Button>
            )}
          </ViewReject>
        </Header>
      )}
      {bookkeepingHiddenList.length > 0 && (
        <>
          <TableSection>
            <TableContainerSection>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell width="220px">
                      <Checkbox
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < bookkeepingHiddenList.length
                        }
                        checked={
                          selected.length === bookkeepingHiddenList.length
                        }
                        onChange={handleSelectAllClick}
                        checkedIcon={<img src={checkedActiveIcon} alt="" />}
                        icon={<img src={checkboxIcon} alt="" />}
                        indeterminateIcon={
                          <img src={checkboxIndeterminate} alt="" />
                        }
                      />
                      Safe
                    </HeaderCell>
                    <HeaderCell width="154px">Counterparty</HeaderCell>
                    <HeaderCell width="328px">Amount</HeaderCell>
                    <HeaderCell width="180px">Category</HeaderCell>
                    <HeaderCell width="176px">Date</HeaderCell>
                    <HeaderCell width="96px"></HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData.map((bookkeeping) => (
                    <>
                      <TableRow>
                        <Cell>
                          <SafeSection>
                            <div>
                              <Checkbox
                                checked={isSelected(bookkeeping.ID)}
                                onChange={(event) =>
                                  handleCheckboxClick(event, bookkeeping.ID)
                                }
                                sx={{
                                  marginRight: "10px",
                                }}
                                checkedIcon={
                                  <img src={checkedActiveIcon} alt="" />
                                }
                                icon={<img src={checkboxIcon} alt="" />}
                              />
                              {getShortAddress(workspace.vault_wallet)}
                            </div>
                            <Logo $dir={bookkeeping.direction}>
                              <img src={rightArrow} alt="" />
                            </Logo>
                          </SafeSection>
                        </Cell>
                        <Cell style={{ paddingLeft: "20px" }}>
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
                              onClick={() =>
                                handleBookkeepingDetails(bookkeeping)
                              }
                            />
                          </Tooltip>
                        </Cell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainerSection>
            {/* pagination */}
            {totalItem > 10 && (
              <PaymentPagination>
                <Pagination
                  handlePageClick={handlePageClick}
                  pageCount={pageCount}
                />
              </PaymentPagination>
            )}
          </TableSection>
        </>
      )}
    </div>
  );
};

export default BookkeepingRejectTable;

// const CategoryCell = styled.div`
//   background: var(--bg-primary);
//   padding: 4px;
//   font-size: 14px;
//   text-align: center;
//   border-radius: 5px;
// `;
const UnhideBtn = styled.div`
  padding-left: 14px;
`;
export const Btn = styled.div`
  display: flex;
  gap: 8px;
  border: 1px solid var(--clr-gray-300);
  padding: 10px 12px;
  border-radius: 5px;
  p {
    font-size: 14px;
    font-weight: 500;
  }
  img {
    width: 16px;
  }
  cursor: pointer;
`;
const Message = styled.div`
  height: 50vh;
  /* border: 1px solid var(--border); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    font-size: 30px;
    font-weight: 500;
  }
  p {
    font-size: 18px;
    padding: 30px 0;
  }
`;
