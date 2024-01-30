import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  CategoryTitle,
  CreateBtn,
  CreateOptionButton,
} from "../category/category.style";
import add from "../../../assets/workspace/add.svg";
import archive from "../../../assets/workspace/archive.svg";
import searchIcon from "../../../assets/workspace/search-icon.svg";
import approve from "../../../assets/workspace/select.svg";
import download from "../../../assets/workspace/download.svg";
import view from "../../../assets/workspace/view.svg";
import importIcon from "../../../assets/workspace/import-icon.svg";
import hide from "../../../assets/workspace/hide.svg";
import back from "../../../assets/workspace/back.svg";
import filterIcon from "../../../assets/workspace/filtering.svg";
import rightArrow from "../../../assets/workspace/right-arrow.svg";

// table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import RejectDataTable from "../../../components/workspace/RejectDataTable";
import {
  ActionBtn,
  Btn,
  CategoryCell,
  Header,
  Image,
  Option,
  PaymentPagination,
  PaymentRequestBody,
  PaymentRequestContainer,
  RejectSection,
  ViewReject,
} from "../paymentRequest/paymentRequest.style";
import data from "../../../data/tableData";
import BookkeepingRejectTable from "../../../components/workspace/BookkeepingRejectTable";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../utils/CustomModal";
import BookkeepingTransferDetails from "./BookkeepingTransferDetails";
import { useBookkeeping } from "../../../store/useBookkeeping";
import usePaymentsStore from "../../../store/usePayments";
import ReactPaginate from "react-paginate";

const Bookkeeping = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    getBookkeepingList,
    exportBookkeepingList,
    importBookkeepingList,
    bookkeepingList,
    hideBookkeepingList,
  } = useBookkeeping();
  const { getPaymentRequestDetails } = usePaymentsStore();

  const recipientFormate = (n: string) => {
    return `${n.slice(0, 6)}...${n.slice(-4)}`;
  };
  const [paymentRequest, setPaymentRequest] = useState(true);

  // pagination
  const [pageNumbers, setPageNumbers] = useState(0);
  const [totalItem, setTotalItem] = useState(0);

  const pageCount = Math.ceil(totalItem / 10);

  const handlePageClick = (event: any) => {
    setPageNumbers(event.selected);
  };
  // visibility
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // fetch bookkeeping data
  const workspaceId = Number(id);
  useEffect(() => {
    getBookkeepingList(workspaceId, visible).then((res) => {
      if (res) {
        setTotalItem(res);
      }
    });
  }, [
    getBookkeepingList,
    visible,
    workspaceId,
    loading,
    paymentRequest,
    pageNumbers,
  ]);

  // table logic
  const [selected, setSelected] = useState<number[]>([]);
  console.log(selected);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(bookkeepingList.map((c) => c.ID));
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

  // end
  const [hasCategory, setHasCategory] = useState(true);

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleBookkeepingDetails = (
    paymentRequestId: number,
    paymentId: number
  ) => {
    getPaymentRequestDetails(Number(id), paymentRequestId, paymentId);
    setOpenModal(true);
  };

  // modal end
  // filter
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleDropdownChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  // hide the selected table row
  const [hiddenRows, setHiddenRows] = useState<number[]>([]);

  // filter table data
  const filterData = bookkeepingList.filter((bookkeeping) => {
    const searchItem = bookkeeping.recipient
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const filterByCategory =
      selectedValue === "" || bookkeeping.category_name === selectedValue;
    return searchItem && filterByCategory;
  });

  // export
  const paymentRequestIds = selected.join(",");
  const handleExportBookkeepingList = () => {
    if (selected.length) {
      exportBookkeepingList(workspaceId, paymentRequestIds);
      setSelected([]);
    }
  };
  // importBookkeepingList

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleImportBookkeepingList = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await importBookkeepingList(workspaceId, formData);
      setLoading(false);
      // handleExportBookkeepingList();
    }
  };
  // hide item
  const handleHideBookkeepingList = async () => {
    if (selected.length) {
      await hideBookkeepingList(workspaceId, paymentRequestIds);
      setVisible(false);
      setLoading(!loading);
      setSelected([]);
    }
  };

  const handleViewHiddenList = () => {
    setPaymentRequest(!paymentRequest);
    setVisible(true);
    setSelected([]);
  };
  const handleBackBtn = () => {
    setPaymentRequest(!paymentRequest);
    setVisible(false);
  };
  // unique category name
  const uniqueCategoryNames = Array.from(
    new Set(bookkeepingList.map((payment) => payment.category_name))
  );

  return (
    <PaymentRequestContainer>
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={BookkeepingTransferDetails}
        // additionalProps={{}}
      />
      {bookkeepingList.length === 0 && paymentRequest ? (
        <CategoryTitle>
          <h3>You don't have any transactions.</h3>
          <p style={{ width: "509px", textAlign: "center" }}>
            Transactions that add tokens to or remove tokens from your Safe will
            show up here.
          </p>
          <CreateBtn onClick={handleViewHiddenList}>
            <img src={view} alt="" style={{ width: "20px" }} />
            <span>View hidden</span>
          </CreateBtn>
        </CategoryTitle>
      ) : (
        <Header>
          <TextField
            id="search"
            type="search"
            autoComplete="off"
            placeholder={t("paymentRequest.SearchToken")}
            value={searchTerm}
            onChange={handleChange}
            sx={{ width: 350 }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={searchIcon} alt="" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 100 }}>
            <Select
              value={selectedValue}
              onChange={handleDropdownChange}
              displayEmpty
              inputProps={{ "aria-label": "Select a value" }}
              size="small"
            >
              <MenuItem value="" disabled>
                <Option>
                  <Image src={filterIcon} alt="" />
                  {t("paymentRequest.Filter")}
                </Option>
              </MenuItem>
              {uniqueCategoryNames.map(
                (categoryName) =>
                  categoryName.trim() !== "" && (
                    <MenuItem value={categoryName} key={categoryName}>
                      {categoryName}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>
          <ViewReject>
            {paymentRequest ? (
              <div onClick={handleViewHiddenList}>
                <Image src={view} alt="" />
                <p>{t("bookkeeping.ViewHidden")}</p>
              </div>
            ) : (
              <div onClick={handleBackBtn}>
                <Image src={back} alt="" />
                <p>{t("paymentRequest.Back")}</p>
              </div>
            )}
          </ViewReject>
        </Header>
      )}

      {bookkeepingList.length > 0 && (
        <>
          {paymentRequest && (
            <PaymentRequestBody>
              <ActionBtn>
                <Btn onClick={() => inputFileRef.current!.click()}>
                  <img src={importIcon} alt="" />
                  <p>{t("bookkeeping.Import")}</p>
                  <input
                    type="file"
                    name=""
                    id=""
                    hidden
                    ref={inputFileRef}
                    onChange={handleImportBookkeepingList}
                  />
                </Btn>
                <Btn onClick={handleExportBookkeepingList}>
                  <img src={download} alt="" />
                  <p>{t("paymentRequest.Download")}</p>
                </Btn>
                <Btn onClick={handleHideBookkeepingList}>
                  <img src={hide} alt="" />
                  <p>{t("paymentRequest.Hide")}</p>
                </Btn>
              </ActionBtn>
              {/* table */}
              <TableContainer
                sx={{
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  maxHeight: 500,
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
                        Recipient
                      </TableCell>
                      <TableCell sx={{ background: "var(--bg-primary)" }}>
                        Amount
                      </TableCell>
                      <TableCell sx={{ background: "var(--bg-primary)" }}>
                        Category
                      </TableCell>
                      <TableCell sx={{ background: "var(--bg-primary)" }}>
                        Date
                      </TableCell>
                      <TableCell
                        sx={{ background: "var(--bg-primary)" }}
                      ></TableCell>
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
                                {recipientFormate(
                                  bookkeeping.currency_contract_address
                                )}
                              </div>
                              <Logo>
                                <img src={rightArrow} alt="" />
                              </Logo>
                            </SafeSection>
                          </TableCell>
                          <TableCell>
                            {recipientFormate(bookkeeping.recipient)}
                          </TableCell>
                          <TableCell>{bookkeeping.amount} USDT</TableCell>
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
                              onClick={() =>
                                handleBookkeepingDetails(
                                  bookkeeping.payment_request_id,
                                  bookkeeping.ID
                                )
                              }
                            >
                              view more
                            </Button>
                            {/* modal */}
                            {/* <CustomModal
                                open={openModal}
                                setOpen={setOpenModal}
                                component={BookkeepingTransferDetails}
                                // additionalProps={{}}
                              /> */}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </PaymentRequestBody>
          )}
          {/* )} */}
        </>
      )}
      {!paymentRequest && (
        <RejectSection>
          <BookkeepingRejectTable
            workspaceId={workspaceId}
            paymentRequest={paymentRequest}
            filterData={filterData}
            handleBookkeepingDetails={handleBookkeepingDetails}
          />
        </RejectSection>
      )}
      {/*  */}
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

      {/* header */}
    </PaymentRequestContainer>
  );
};

export default Bookkeeping;

export const SafeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const Logo = styled.div`
  flex: 0 0 30%;
  img {
    width: 20px;
  }
`;
