import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
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
import styled from "@emotion/styled";
import { useBookkeeping } from "../../../store/useBookkeeping";
import { getShortAddress } from "../../../utils";
import { useWorkspace } from "../../../store/useWorkspace";
import { formatNumber } from "../../../utils/number";
import {
  ActionBtn,
  Filter,
  Header,
  Image,
  Option,
  PaymentPagination,
  TableSection,
  ViewReject,
} from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import Pagination from "../../Pagination";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import searchIcon from "../../../assets/workspace/search-icon.svg";
import filterIcon from "../../../assets/workspace/filtering.svg";
import { useTranslation } from "react-i18next";
import { getPaymentUpdateTime } from "../../../utils/payment";
import { useDomainStore } from "../../../store/useDomain";
import SearchInput from "../SearchInput";
import FilterCategorySelect from "../FilterCategorySelect";

const HeaderStyles = {
  fontSize: "14px",
  fontWeight: "500",
  fontFamily: "Inter",
  color: "var(--clr-primary-900)",
  background: "var(--clr-gray-200)",
  padding: "0 16px",
};
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
              <Btn onClick={handleUnHideBookkeepingList}>
                <img src={hide} alt="" />
                <p>Unhide</p>
              </Btn>
            </UnhideBtn>
          </Filter>
          <ViewReject>
            {bookkeepingHiddenList.length > 0 && !paymentRequest && (
              <div onClick={handleBackBtn}>
                <Image src={back} alt="" />
                <p>{t("paymentRequest.Back")}</p>
              </div>
            )}
          </ViewReject>
        </Header>
      )}
      {bookkeepingHiddenList.length > 0 && (
        <>
          <TableSection>
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
              <Table>
                <TableHead
                  style={{ background: "var(--clr-gray-200)", height: "55px" }}
                >
                  <TableRow>
                    <TableCell sx={HeaderStyles}>
                      <Checkbox
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < bookkeepingHiddenList.length
                        }
                        checked={
                          selected.length === bookkeepingHiddenList.length
                        }
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
                    <>
                      <TableRow>
                        <TableCell
                          style={{
                            // padding: 0,
                            padding: "0 16px",
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
                              {getShortAddress(workspace.vault_wallet)}
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
                          <CategoryCell>
                            {bookkeeping.category_name}
                          </CategoryCell>
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
                              onClick={() =>
                                handleBookkeepingDetails(bookkeeping)
                              }
                            />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

const CategoryCell = styled.div`
  background: var(--bg-primary);
  padding: 4px;
  font-size: 14px;
  text-align: center;
  border-radius: 5px;
`;
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
