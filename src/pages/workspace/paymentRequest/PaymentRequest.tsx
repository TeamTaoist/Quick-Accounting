import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import React, { ChangeEvent, useEffect, useState } from "react";
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
import reject from "../../../assets/workspace/reject.svg";
import back from "../../../assets/workspace/back.svg";
import filterIcon from "../../../assets/workspace/filtering.svg";

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
  InputLabel,
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
} from "./paymentRequest.style";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../utils/CustomModal";
import PaymentRequestDetails from "./PaymentRequestDetails";
import SignPaymentRequest from "./SignPaymentRequest";
import usePaymentsStore from "../../../store/usePayments";
import PaymentRequestGroupDetails from "../../../components/paymentRequest/PaymentRequestGroupDetails";
import NewPaymentRequest from "../../workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import ReactPaginate from "react-paginate";
import { formatNumber } from "../../../utils/number";
import { useCategoryProperty } from "../../../store/useCategoryProperty";

const PaymentRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    getPaymentRequestList,
    paymentRequestList,
    getPaymentRequestDetails,
    rejectPaymentRequest,
    getPaymentRequestGroupDetails,
  } = usePaymentsStore();
  const { getWorkspaceCategoryProperties } = useCategoryProperty();
  // table logic
  const recipientFormate = (n: string) => {
    return `${n.slice(0, 6)}...${n.slice(-4)}`;
  };
  const [newPaymentsVisible, setNewPaymentsVisible] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [openRows, setOpenRows] = useState<number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(
        paymentRequestList.map((payment) => payment.payment_request_id)
      );
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

  const handleRowToggle = (categoryId: number) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(categoryId)
        ? prevOpenRows.filter((id) => id !== categoryId)
        : [...prevOpenRows, categoryId]
    );
  };

  const isSelected = (categoryId: number) =>
    selected.indexOf(categoryId) !== -1;

  // end
  const [hasCategory, setHasCategory] = useState(true);
  const [paymentRequest, setPaymentRequest] = useState(true);
  // modal
  const [openModal, setOpenModal] = useState(false);
  const [openGroupPaymentModal, setOpenGroupPaymentModal] = useState(false);
  const [openSignPaymentModal, setSignPaymentModal] = useState(false);
  const [test, setTest] = useState(false);

  const handleOpenModal = (paymentRequestId: number, paymentId: number) => {
    getPaymentRequestDetails(Number(id), paymentRequestId, paymentId).then(
      (res) => {
        if (res) {
          setOpenModal(true);
        }
      }
    );
  };

  // group payment details
  const handleGroupPaymentDetails = (paymentRequestId: string) => {
    getPaymentRequestGroupDetails(Number(id), paymentRequestId).then((r) => {
      if (r) {
        setOpenGroupPaymentModal(true);
      }
    });
  };

  // modal end
  // search payments
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleDropdownChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  // filter table data
  const filterData = paymentRequestList.filter((data) => {
    const searchItem = data.recipient
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const filterByCategory =
      selectedValue === "" || data.category_name === selectedValue;
    return searchItem && filterByCategory;
  });
  // fetch payment request
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [rejectPaymentLoading, setRejectPaymentLoading] =
    useState<boolean>(false);

  // pagination
  const [pageNumbers, setPageNumbers] = useState(0);
  const [totalItem, setTotalItem] = useState(0);

  const pageCount = Math.ceil(totalItem / 10);

  const handlePageClick = (event: any) => {
    setPageNumbers(event.selected);
  };

  const workspaceId = Number(id);
  useEffect(() => {
    getPaymentRequestList(workspaceId, false, pageNumbers).then((res) => {
      setTotalItem(res);
    });
    getWorkspaceCategoryProperties(Number(id));
  }, [
    getPaymentRequestList,
    workspaceId,
    paymentLoading,
    rejectPaymentLoading,
    newPaymentsVisible,
    pageNumbers,
  ]);
  // payment_request_id

  const groupedData = filterData.reduce((acc, item) => {
    const paymentRequestId = item.payment_request_id;
    if (!acc[paymentRequestId]) {
      acc[paymentRequestId] = [];
    }
    acc[paymentRequestId].push(item);
    return acc;
  }, {} as Record<number, IPaymentRequest[]>);
  console.log(groupedData);
  console.log(Object.entries(groupedData));

  const sortedPayment = Object.entries(groupedData).sort(
    ([idA, itemsA], [idB, itemsB]) => {
      const lengthComparison = itemsA.length - itemsB.length;

      return lengthComparison !== 0
        ? lengthComparison
        : Number(idA) - Number(idB);
    }
  );
  // approve modal
  const handlePaymentRequestChaiModal = () => {
    console.log(selected);
    if (selected.length) {
      setSignPaymentModal(true);
    }
  };

  // reject payment request
  const paymentRequestIds = selected.join(",");
  const handleRejectPaymentRequest = async () => {
    if (selected.length) {
      await rejectPaymentRequest(id, paymentRequestIds);
      setPaymentLoading(!paymentLoading);
      setSelected([]);
    }
  };

  // get rejected payments
  const handleRejectedPayments = () => {
    // getPaymentRequestList(workspaceId, true);
    // setRejectPaymentLoading(rejectPaymentLoading);
    setSearchTerm("");
    setSelectedValue("");
    setPaymentRequest(false);
    // setPaymentLoading(!paymentLoading);
    console.log("click");
  };
  const handleBackBtn = () => {
    setPaymentLoading(!paymentLoading);
    setSearchTerm("");
    setSelectedValue("");
  };
  // unique category name
  const uniqueCategoryNames = Array.from(
    new Set(paymentRequestList.map((payment) => payment.category_name))
  );
  return (
    <PaymentRequestContainer>
      {paymentRequestList.length === 0 && paymentRequest ? (
        <CategoryTitle>
          <h3>No payment request yet.</h3>
          <p style={{ width: "509px", textAlign: "center" }}>
            Payments requests are requested by share link or drafted directly by
            multi-signer will show up here.
          </p>
          <CreateOptionButton>
            <CreateBtn onClick={() => setNewPaymentsVisible(true)}>
              <img src={add} alt="" />
              <span>Create request</span>
            </CreateBtn>
            <CreateBtn onClick={handleRejectedPayments}>
              <img src={archive} alt="" />
              <span>View rejection</span>
            </CreateBtn>
          </CreateOptionButton>
        </CategoryTitle>
      ) : (
        <>
          {/* payment request details modal */}
          <CustomModal
            open={openModal}
            setOpen={setOpenModal}
            component={PaymentRequestDetails}
          />
          {/* payment request group details modal */}
          <CustomModal
            open={openGroupPaymentModal}
            setOpen={setOpenGroupPaymentModal}
            component={PaymentRequestGroupDetails}
          />
          {/* payment request modal */}
          <CustomModal
            open={openSignPaymentModal}
            setOpen={setSignPaymentModal}
            component={SignPaymentRequest}
            additionalProps={{
              selectedItem: selected,
            }}
          />
          <Header>
            <div>
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
              <FormControl sx={{ marginLeft: "25px", minWidth: 100 }}>
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
            </div>
            <ViewReject onClick={() => setPaymentRequest(!paymentRequest)}>
              {paymentRequest ? (
                <div onClick={handleRejectedPayments}>
                  <Image src={reject} alt="" />
                  <p>{t("paymentRequest.ViewRejection")}</p>
                </div>
              ) : (
                <div onClick={handleBackBtn}>
                  <Image src={back} alt="" />
                  <p>{t("paymentRequest.Back")}</p>
                </div>
              )}
            </ViewReject>
          </Header>
          {paymentRequest && (
            <PaymentRequestBody>
              <ActionBtn>
                <Btn>
                  <img src={download} alt="" />
                  <p>{t("paymentRequest.Download")}</p>
                </Btn>
                <Btn onClick={handleRejectPaymentRequest}>
                  <img src={reject} alt="" />
                  <p>{t("paymentRequest.Reject")}</p>
                </Btn>
                <Btn onClick={() => handlePaymentRequestChaiModal()}>
                  <img src={approve} alt="" />
                  <p>{t("paymentRequest.Approve")}</p>
                </Btn>
              </ActionBtn>
              {/* table */}
              <TableContainer
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  minWidth: "800px",
                }}
              >
                <Table size="small">
                  <TableHead style={{ backgroundColor: "#f0f0f0" }}>
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < paymentRequestList.length
                          }
                          checked={
                            selected.length === paymentRequestList.length
                          }
                          onChange={handleSelectAllClick}
                        />
                        Recipient
                      </TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedPayment.map(([id, items], index) => (
                      <React.Fragment key={index}>
                        {items.length > 1 ? (
                          <TableRow
                            onClick={() => handleRowToggle(Number(id))}
                            style={{ cursor: "pointer" }}
                          >
                            <TableCell
                              colSpan={4}
                              style={{
                                padding: 0,
                                paddingLeft: "16px",
                                borderBottom: "1px solid #ddd",
                                borderTop: "none",
                                position: "relative",
                              }}
                            >
                              <Checkbox
                                checked={isSelected(Number(id))}
                                onChange={(event) =>
                                  handleCheckboxClick(event, Number(id))
                                }
                              />
                              {items.length} payment requests
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                style={{
                                  position: "absolute",
                                  left: "200px",
                                }}
                              >
                                {openRows.includes(Number(id)) ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                sx={{
                                  borderColor: "black",
                                  color: "black",
                                  textTransform: "lowercase",
                                }}
                                onClick={() => handleGroupPaymentDetails(id)}
                              >
                                view more
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          // )}
                          <>
                            {items.map((payment) => (
                              <TableRow key={payment.ID}>
                                <TableCell
                                  style={{
                                    padding: 0,
                                    paddingLeft: "16px",
                                    borderBottom: "1px solid #ddd",
                                    borderTop: "none",
                                  }}
                                >
                                  <Checkbox
                                    checked={isSelected(
                                      payment.payment_request_id
                                    )}
                                    onChange={(event) =>
                                      handleCheckboxClick(
                                        event,
                                        payment.payment_request_id
                                      )
                                    }
                                  />
                                  {recipientFormate(payment.recipient)}
                                </TableCell>
                                <TableCell>
                                  {formatNumber(Number(payment.amount))}{" "}
                                  {payment.currency_name}
                                </TableCell>
                                <TableCell>
                                  {payment.category_name && (
                                    <CategoryCell>
                                      {payment.category_name}
                                    </CategoryCell>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {payment.CreatedAt.slice(0, 10)}
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
                                      handleOpenModal(
                                        payment.payment_request_id,
                                        payment.ID
                                      )
                                    }
                                  >
                                    view more
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </>
                        )}
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            sx={{
                              padding: 0,
                              // paddingLeft: "16px",
                              borderTop: "1px solid #ddd",
                            }}
                          >
                            <Collapse
                              in={openRows.includes(Number(id))}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Table size="small">
                                <TableBody>
                                  {items.map((payments) => (
                                    <TableRow key={payments.ID}>
                                      <TableCell
                                        // colSpan={1}
                                        sx={{
                                          paddingLeft: "58px",
                                          maxWidth: "112px",
                                        }}
                                      >
                                        {recipientFormate(payments.recipient)}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          maxWidth: "50px",
                                        }}
                                      >
                                        {payments.amount}{" "}
                                        {payments.currency_name}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          maxWidth: "78px",
                                        }}
                                      >
                                        <CategoryCell>
                                          {payments.category_name}
                                        </CategoryCell>
                                      </TableCell>
                                      <TableCell>
                                        {payments.CreatedAt.slice(0, 10)}
                                      </TableCell>
                                      <TableCell
                                      // sx={{ width: "100px" }}
                                      ></TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
            </PaymentRequestBody>
          )}
          {/* {!paymentRequest && (
            <RejectSection>
              <RejectDataTable
                searchTerm={searchTerm}
                selectedValue={selectedValue}
              />
            </RejectSection>
          )} */}
        </>
      )}
      {!paymentRequest && (
        <RejectSection>
          <RejectDataTable
            searchTerm={searchTerm}
            selectedValue={selectedValue}
          />
        </RejectSection>
      )}
      {newPaymentsVisible && (
        <NewPaymentRequest onClose={() => setNewPaymentsVisible(false)} />
      )}
    </PaymentRequestContainer>
  );
};

export default PaymentRequest;
