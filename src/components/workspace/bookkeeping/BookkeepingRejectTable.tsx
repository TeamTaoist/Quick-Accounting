import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
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
import styled from "@emotion/styled";
import { useBookkeeping } from "../../../store/useBookkeeping";
import { getShortAddress } from "../../../utils";
import { useWorkspace } from "../../../store/useWorkspace";
import { formatNumber } from "../../../utils/number";
import {
  PaymentPagination,
  TableSection,
} from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import ReactPaginate from "react-paginate";

interface RejectTableProps {
  workspaceId: number;
  paymentRequest: boolean;
  handleBackBtn: () => void;
  searchTerm?: string | undefined;
  selectedValue?: string;
}
const BookkeepingRejectTable = ({
  workspaceId,
  paymentRequest,
  // handleBookkeepingDetails,
  handleBackBtn,
  searchTerm,
  selectedValue,
}: RejectTableProps) => {
  const { bookkeepingHiddenList, unHideBookkeepingList, getBookkeepingList } =
    useBookkeeping();
  const { workspace } = useWorkspace();

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
  const filterData = bookkeepingHiddenList.filter((bookkeeping) => {
    const searchItem = bookkeeping.recipient
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

  return (
    <div>
      {bookkeepingHiddenList.length === 0 && !paymentRequest ? (
        <Message>
          <h3>You don't have any hidden transactions.</h3>
          <p style={{ width: "509px", textAlign: "center" }}>
            Transactions that add tokens to or remove tokens from your Safe will
            show up here.
          </p>
          <HideBtn onClick={handleBackBtn}>
            <img src={back} alt="" style={{ width: "20px" }} />
            <span>Back</span>
          </HideBtn>
        </Message>
      ) : (
        <>
          <UnhideBtn>
            <Btn onClick={handleUnHideBookkeepingList}>
              <img src={hide} alt="" />
              <p>Unhide</p>
            </Btn>
          </UnhideBtn>
          <TableSection>
            <TableContainer
              sx={{
                border: "1px solid var(--border)",
                borderRadius: "10px",
                maxHeight: "100%",
                overflow: "auto",
              }}
            >
              <Table>
                <TableHead style={{ backgroundColor: "#f0f0f0" }}>
                  <TableRow>
                    <TableCell>
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
                    <TableCell>Counterparty</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData.map((bookkeeping) => (
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
                                checked={isSelected(bookkeeping.ID)}
                                onChange={(event) =>
                                  handleCheckboxClick(event, bookkeeping.ID)
                                }
                              />
                              {getShortAddress(workspace.vault_wallet)}
                            </div>
                            <Logo>
                              <img src={rightArrow} alt="" />
                            </Logo>
                          </SafeSection>
                        </TableCell>
                        <TableCell>
                          {getShortAddress(bookkeeping.recipient)}
                        </TableCell>
                        <TableCell>
                          {formatNumber(Number(bookkeeping.amount))}{" "}
                          {bookkeeping.currency_name}
                        </TableCell>
                        <TableCell>
                          <CategoryCell>
                            {bookkeeping.category_name}
                          </CategoryCell>
                        </TableCell>
                        <TableCell>
                          {bookkeeping.CreatedAt.slice(0, 10)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            sx={{
                              borderColor: "black",
                              color: "black",
                              textTransform: "lowercase",
                            }}
                            // onClick={() =>
                            //   handleBookkeepingDetails(
                            //     bookkeeping.payment_request_id,
                            //     bookkeeping.ID
                            //   )
                            // }
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
            {/* pagination */}
            {totalItem > 10 && (
              <PaymentPagination>
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={pageCount}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  containerClassName="pagination"
                  pageLinkClassName="page-num"
                  previousLinkClassName="page-arrow"
                  nextLinkClassName="page-arrow"
                  activeLinkClassName="active"
                  // initialPage={2}
                  forcePage={0}
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
  cursor: pointer;
  img {
    width: 22px;
  }
  p {
    font-size: 20px;
  }
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
