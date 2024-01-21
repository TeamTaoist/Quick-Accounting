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

interface SubPayment {
  id: number;
  idNumber: string;
  category: string;
  amount: number;
  date: string;
}

interface Payment {
  id: number;
  idNumber: string;
  category: string;
  amount: number;
  date: string;
  subPayment: SubPayment[];
}

const payments: Payment[] = [
  {
    id: 1,
    idNumber: "0Xdf344...4324",
    amount: 100,
    category: "category 1",
    date: "2024-01-01",
    subPayment: [],
  },
  {
    id: 2,
    idNumber: "0Xdf344...4324",
    amount: 150,
    category: "category 2",
    date: "2024-01-02",
    subPayment: [],
  },
  {
    id: 3,
    idNumber: "0Xdf344...4324",
    amount: 200,
    category: "category 1",
    date: "2024-01-03",
    subPayment: [],
  },
  {
    id: 4,
    idNumber: "0Xdf344...4324",
    amount: 120,
    category: "category 3",
    date: "2024-01-04",
    subPayment: [
      {
        id: 1,
        idNumber: "0Xdf344...4324",
        amount: 120,
        category: "category name",
        date: "2024-01-04",
      },
      {
        id: 2,
        idNumber: "0Xdf344...4324",
        amount: 120,
        category: "category name",
        date: "2024-01-04",
      },
      {
        id: 3,
        idNumber: "0Xdf344...4324",
        amount: 120,
        category: "category name",
        date: "2024-01-04",
      },
    ],
  },
];

const PaymentRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    getPaymentRequestList,
    paymentRequestList,
    getPaymentRequestDetails,
  } = usePaymentsStore();
  // table logic
  const recipientFormate = (n: string) => {
    return `${n.slice(0, 6)}...${n.slice(-4)}`;
  };
  const [selected, setSelected] = useState<number[]>([]);
  const [openRows, setOpenRows] = useState<number[]>([]);
  console.log(selected);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(paymentRequestList.map((payment) => payment.ID));
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
  const [openSignPaymentModal, setSignPaymentModal] = useState(false);

  const handleOpenModal = (paymentRequestId: number) => {
    setOpenModal(true);
    getPaymentRequestDetails(Number(id), paymentRequestId);
  };
  // modal end
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
    // const filterByCategory =
    //   selectedValue === "" || data.category_name === selectedValue;
    // return searchItem && filterByCategory;
    return searchItem;
  });
  // fetch payment request
  const workspaceId = Number(id);
  useEffect(() => {
    getPaymentRequestList(workspaceId, 0, 10);
  }, [getPaymentRequestList, workspaceId]);
  console.log(filterData);
  console.log(searchTerm);

  return (
    <WorkspaceLayout>
      <PaymentRequestContainer>
        {!hasCategory && (
          <CategoryTitle>
            <h3>No payment request yet.</h3>
            <p style={{ width: "509px", textAlign: "center" }}>
              Payments requests are requested by share link or drafted directly
              by multi-signer will show up here.
            </p>
            <CreateOptionButton>
              <CreateBtn>
                <img src={add} alt="" />
                <span>Create category</span>
              </CreateBtn>
              <CreateBtn>
                <img src={archive} alt="" />
                <span>View archive</span>
              </CreateBtn>
            </CreateOptionButton>
          </CategoryTitle>
        )}
        {/* header */}
        <Header>
          <div>
            <TextField
              id="search"
              type="search"
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
            <FormControl sx={{ marginLeft: "25px" }}>
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
                <MenuItem value="category 1">Category 1</MenuItem>
                <MenuItem value="category 2">Category 2</MenuItem>
                <MenuItem value="category 3">Category 3</MenuItem>
              </Select>
            </FormControl>
          </div>
          <ViewReject onClick={() => setPaymentRequest(!paymentRequest)}>
            {paymentRequest ? (
              <div>
                <Image src={reject} alt="" />
                <p>{t("paymentRequest.ViewRejection")}</p>
              </div>
            ) : (
              <div>
                <Image src={back} alt="" />
                <p>{t("paymentRequest.Back")}</p>
              </div>
            )}
          </ViewReject>
        </Header>
        {paymentRequest ? (
          <PaymentRequestBody>
            <ActionBtn>
              <Btn>
                <img src={download} alt="" />
                <p>{t("paymentRequest.Download")}</p>
              </Btn>
              <Btn>
                <img src={reject} alt="" />
                <p>{t("paymentRequest.Reject")}</p>
              </Btn>
              <Btn onClick={() => setSignPaymentModal(true)}>
                <img src={approve} alt="" />
                <p>{t("paymentRequest.Approve")}</p>
              </Btn>
              <CustomModal
                open={openSignPaymentModal}
                setOpen={setSignPaymentModal}
                component={SignPaymentRequest}
              />
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
                          selected.length < payments.length
                        }
                        checked={selected.length === payments.length}
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
                  {filterData.map((payment) => (
                    <React.Fragment key={payment.ID}>
                      {/* {payment.subPayment.length > 0 ? ( */}
                      <TableRow
                        onClick={() => handleRowToggle(payment.ID)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* <TableCell
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
                            checked={isSelected(payment.ID)}
                            onChange={(event) =>
                              handleCheckboxClick(event, payment.ID)
                            }
                          />
                          3 payment requests
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            style={{
                              position: "absolute",
                              left: "200px",
                            }}
                          >
                            {openRows.includes(payment.ID) ? (
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
                            onClick={handleOpenModal}
                          >
                            view more
                          </Button> */}
                        {/* modal */}
                        {/* <CustomModal
                              open={openModal}
                              setOpen={setOpenModal}
                              component={PaymentRequestDetails}
                            /> */}
                        {/* </TableCell> */}
                      </TableRow>
                      {/* ) : ( */}
                      <TableRow>
                        <TableCell
                          style={{
                            padding: 0,
                            paddingLeft: "16px",
                            borderBottom: "1px solid #ddd",
                            borderTop: "none",
                          }}
                        >
                          <Checkbox
                            checked={isSelected(payment.ID)}
                            onChange={(event) =>
                              handleCheckboxClick(event, payment.ID)
                            }
                          />
                          {recipientFormate(payment.recipient)}
                        </TableCell>
                        <TableCell>{payment.amount} USDT</TableCell>
                        <TableCell>
                          <CategoryCell>{payment.category_name}</CategoryCell>
                        </TableCell>
                        <TableCell>{payment.CreatedAt.slice(0, 10)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            sx={{
                              borderColor: "black",
                              color: "black",
                              textTransform: "lowercase",
                            }}
                            onClick={() =>
                              handleOpenModal(payment.payment_request_id)
                            }
                          >
                            view more
                          </Button>
                          {/* modal */}
                          <CustomModal
                            open={openModal}
                            setOpen={setOpenModal}
                            component={PaymentRequestDetails}
                            additionalProps={{
                              paymentRequestId: payment.payment_request_id,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                      {/* )} */}
                      {/* <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{
                            padding: 0,
                            // paddingLeft: "16px",
                            borderTop: "1px solid #ddd",
                          }}
                        >
                          <Collapse
                            in={openRows.includes(payment.id)}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableBody>
                                {payment.subPayment.map((subCategory) => (
                                  <TableRow key={subCategory.id}>
                                    <TableCell
                                      // colSpan={1}
                                      sx={{
                                        paddingLeft: "58px",
                                        maxWidth: "90px",
                                      }}
                                    >
                                      {subCategory.idNumber}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        maxWidth: "56px",
                                      }}
                                    >
                                      {subCategory.amount} USDT
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        maxWidth: "78px",
                                      }}
                                    >
                                      <CategoryCell>
                                        {subCategory.category}
                                      </CategoryCell>
                                    </TableCell>
                                    <TableCell>{subCategory.date}</TableCell>
                                    <TableCell
                                    // sx={{ width: "100px" }}
                                    ></TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Collapse>
                        </TableCell>
                      </TableRow> */}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </PaymentRequestBody>
        ) : (
          <RejectSection>
            <RejectDataTable />
          </RejectSection>
        )}
      </PaymentRequestContainer>
    </WorkspaceLayout>
  );
};

export default PaymentRequest;
