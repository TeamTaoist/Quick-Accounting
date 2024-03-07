import React, { useEffect, useState } from "react";
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
import {
  Checkbox,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  ActionBtn,
  Btn,
  Header,
  Image,
  Option,
  PaymentPagination,
  PaymentRequestBody,
  PaymentRequestContainer,
  RejectSection,
  TableSection,
  ViewReject,
} from "./paymentRequest.style";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../utils/CustomModal";
import PaymentRequestDetails from "./PaymentRequestDetails";
import SignPaymentRequest from "./SignPaymentRequest";
import usePaymentsStore from "../../../store/usePayments";
import PaymentRequestGroupDetails from "../../../components/workspace/paymentRequest/PaymentRequestGroupDetails";
import NewPaymentRequest from "../../workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import ReactPaginate from "react-paginate";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
import PaymentRequestTableList from "../../../components/workspace/paymentRequest/PaymentRequestTableList";
import Pagination from "../../../components/Pagination";
import RejectPaymentRequestTable from "../../../components/workspace/paymentRequest/RejectPaymentRequestTable";
import { useWorkspace } from "../../../store/useWorkspace";
import { useDomainStore } from "../../../store/useDomain";

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
    exportPaymentList,
    setCurrentPaymentRequestDetail,
  } = usePaymentsStore();
  const { workspace } = useWorkspace();
  const { queryNameService } = useDomainStore();

  const { getWorkspaceCategoryProperties } = useCategoryProperty();
  // table logic
  console.log(paymentRequestList);

  const [newPaymentsVisible, setNewPaymentsVisible] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  // const [openRows, setOpenRows] = useState<number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(
        paymentRequestList.map((payment) => payment.payment_request_id)
      );
    } else {
      setSelected([]);
    }
  };

  // end
  const [paymentRequest, setPaymentRequest] = useState(true);
  // modal
  const [openModal, setOpenModal] = useState(false);
  const [openGroupPaymentModal, setOpenGroupPaymentModal] = useState(false);
  const [openSignPaymentModal, setSignPaymentModal] = useState(false);

  const handleOpenModal = (payment: IPaymentRequest) => {
    setCurrentPaymentRequestDetail(payment);
    setOpenModal(true);
  };

  // group payment details
  const [groupDetails, setGroupDetails] = useState<IPaymentRequest[]>([]);
  const handleGroupPaymentDetails = (items: IPaymentRequest[]) => {
    setGroupDetails(items);
    setOpenGroupPaymentModal(true);
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
    const searchItem = data.counterparty
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const filterByCategory =
      selectedValue === "" || data.category_name === selectedValue;
    return searchItem && filterByCategory;
  });
  // fetch payment request
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
  }, [
    getPaymentRequestList,
    workspaceId,
    rejectPaymentLoading,
    newPaymentsVisible,
    pageNumbers,
  ]);

  useEffect(() => {
    getWorkspaceCategoryProperties(Number(id), true);
  }, []);

  useEffect(() => {
    if (paymentRequestList.length && workspace.chain_id) {
      queryNameService(
        paymentRequestList,
        workspace.name_service === "sns",
        workspace.chain_id
      );
    }
  }, [paymentRequestList, workspace.chain_id, queryNameService]);

  // payment_request_id

  const groupedData = filterData.reduce((acc, item) => {
    const paymentRequestId = item.payment_request_id;
    if (!acc[paymentRequestId]) {
      acc[paymentRequestId] = [];
    }
    acc[paymentRequestId].push(item);
    return acc;
  }, {} as Record<number, IPaymentRequest[]>);

  const sortedPayment = Object.entries(groupedData).sort(
    ([idA, itemsA], [idB, itemsB]) => {
      if (itemsA.length && itemsB.length) {
        const aTime = new Date(itemsA[0].CreatedAt).getTime();
        const bTime = new Date(itemsB[0].CreatedAt).getTime();
        return bTime - aTime;
      }
      return Number(idA) - Number(idB);
    }
  );
  // approve modal
  const handlePaymentRequestChaiModal = () => {
    if (selected.length) {
      setSignPaymentModal(true);
    }
  };

  // reject payment request
  const paymentRequestIds = selected.join(",");
  const handleRejectPaymentRequest = async () => {
    if (selected.length) {
      await rejectPaymentRequest(id, paymentRequestIds);
      await getPaymentRequestList(workspaceId, false, pageNumbers).then(
        (res) => {
          setTotalItem(res);
        }
      );
      setSelected([]);
    }
  };

  // get rejected payments
  const handleRejectedPayments = () => {
    setSearchTerm("");
    setSelectedValue("");
    setPaymentRequest(false);
  };
  const handleBackBtn = () => {
    setSearchTerm("");
    setSelectedValue("");
  };
  // unique category name
  const uniqueCategoryNames = Array.from(
    new Set(paymentRequestList.map((payment) => payment.category_name))
  );
  // export

  const handleExportPaymentRequestList = () => {
    if (selected.length) {
      exportPaymentList(id, paymentRequestIds);
      setSelected([]);
    }
  };
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
            additionalProps={{ pageName: "payment-request" }}
          />
          {/* payment request group details modal */}
          <CustomModal
            open={openGroupPaymentModal}
            setOpen={setOpenGroupPaymentModal}
            component={PaymentRequestGroupDetails}
            additionalProps={{ groupDetails }}
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
                placeholder={t("paymentRequest.Search")}
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
                <Btn onClick={handleExportPaymentRequestList}>
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
              <TableSection>
                {/* table */}
                <TableContainer
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    maxHeight: "100%",
                    overflow: "auto",
                  }}
                >
                  <Table size="small">
                    <TableHead style={{ backgroundColor: "#f0f0f0" }}>
                      <TableRow>
                        <TableCell sx={{ width: "30%" }}>
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
                        <TableCell sx={{ width: "20%" }}>Amount</TableCell>
                        <TableCell sx={{ width: "20%" }}>Category</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedPayment.map(([id, items], index) => (
                        <PaymentRequestTableList
                          items={items}
                          index={index}
                          selected={selected}
                          setSelected={setSelected}
                          handleGroupPaymentDetails={handleGroupPaymentDetails}
                          handleOpenModal={handleOpenModal}
                          paymentId={id}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {totalItem > 10 && (
                  <PaymentPagination>
                    <Pagination
                      handlePageClick={handlePageClick}
                      pageCount={pageCount}
                    />
                  </PaymentPagination>
                )}
              </TableSection>
            </PaymentRequestBody>
          )}
        </>
      )}
      {!paymentRequest && (
        <RejectSection>
          <RejectPaymentRequestTable
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
