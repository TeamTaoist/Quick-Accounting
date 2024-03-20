import React, { useEffect, useState } from "react";
import reject from "../../../assets/workspace/reject.svg";
import back from "../../../assets/workspace/back.svg";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  Filter,
  Header,
  Image,
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
import { useCategoryProperty } from "../../../store/useCategoryProperty";
import PaymentRequestTableList from "../../../components/workspace/paymentRequest/PaymentRequestTableList";
import Pagination from "../../../components/Pagination";
import RejectPaymentRequestTable from "../../../components/workspace/paymentRequest/RejectPaymentRequestTable";
import { useWorkspace } from "../../../store/useWorkspace";
import { useDomainStore } from "../../../store/useDomain";
import SearchInput from "../../../components/workspace/SearchInput";
import NoPaymentFoundMessage from "../../../components/workspace/paymentRequest/NoPaymentFoundMessage";
import FilterCategorySelect from "../../../components/workspace/FilterCategorySelect";
import ActionButton from "../../../components/workspace/paymentRequest/ActionButton";
import { CheckBoxStyle } from "../../../components/workspace/category/CategoryArchivedList";

const PaymentRequest = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    getPaymentRequestList,
    paymentRequestList,
    rejectPaymentRequest,
    exportPaymentList,
    setCurrentPaymentRequestDetail,
    filterData,
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
  const [isSearch, setIsSearch] = useState(false);
  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchPayment = (e: any) => {
    e.preventDefault();
    getPaymentRequestList(workspaceId, false, pageNumbers, 10, searchTerm).then(
      (res) => {
        setTotalItem(res);
        setIsSearch(true);
      }
    );
  };
  useEffect(() => {
    if (!searchTerm && isSearch) {
      getPaymentRequestList(
        workspaceId,
        false,
        pageNumbers,
        10,
        searchTerm
      ).then((res) => {
        setTotalItem(res);
        setIsSearch(false);
      });
    }
  }, [searchTerm]);

  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleDropdownChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
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
    getPaymentRequestList(workspaceId, false, pageNumbers, 10, searchTerm).then(
      (res) => {
        setTotalItem(res);
      }
    );
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
        <NoPaymentFoundMessage
          setNewPaymentsVisible={setNewPaymentsVisible}
          handleRejectedPayments={handleRejectedPayments}
        />
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
          {/* header component */}
          {paymentRequest && (
            <Header>
              <Filter>
                <SearchInput
                  handleSearchPayment={handleSearchPayment}
                  placeholder="Search token"
                  searchTerm={searchTerm}
                  handleChange={handleChange}
                  width="220px"
                />
                <FilterCategorySelect
                  selectedValue={selectedValue}
                  handleDropdownChange={handleDropdownChange}
                  uniqueCategoryNames={uniqueCategoryNames}
                />
                {/* action */}
                <ActionButton
                  handleExportPaymentRequestList={
                    handleExportPaymentRequestList
                  }
                  handleRejectPaymentRequest={handleRejectPaymentRequest}
                  handlePaymentRequestChaiModal={handlePaymentRequestChaiModal}
                />
              </Filter>
              <ViewReject onClick={() => setPaymentRequest(!paymentRequest)}>
                <div onClick={handleRejectedPayments}>
                  <Image src={reject} alt="" />
                  <p>{t("paymentRequest.ViewRejection")}</p>
                </div>
              </ViewReject>
            </Header>
          )}
          {paymentRequest && (
            <PaymentRequestBody>
              <TableSection>
                {/* table */}
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
                    // fontFamily: "Inter",
                  }}
                >
                  <Table size="small">
                    <TableHead
                      style={{
                        backgroundColor: "var(--clr-gray-200)",
                      }}
                    >
                      <TableRow>
                        <TableCell
                          sx={{
                            width: "30%",
                            fontSize: "14px",
                            fontWeight: "500",
                            fontFamily: "Inter",
                            color: "var(--clr-primary-900)",
                          }}
                        >
                          <Checkbox
                            indeterminate={
                              selected.length > 0 &&
                              selected.length < paymentRequestList.length
                            }
                            checked={
                              selected.length === paymentRequestList.length
                            }
                            sx={CheckBoxStyle}
                            onChange={handleSelectAllClick}
                          />
                          Recipient
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "20%",
                            fontSize: "14px",
                            fontWeight: "500",
                            fontFamily: "Inter",
                            color: "var(--clr-primary-900)",
                          }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "20%",
                            fontSize: "14px",
                            fontWeight: "500",
                            fontFamily: "Inter",
                            color: "var(--clr-primary-900)",
                          }}
                        >
                          Category
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "14px",
                            fontWeight: "500",
                            fontFamily: "Inter",
                            color: "var(--clr-primary-900)",
                          }}
                        >
                          Date
                        </TableCell>
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
                  <Pagination
                    handlePageClick={handlePageClick}
                    pageCount={pageCount}
                    pageNumbers={pageNumbers}
                  />
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
            paymentRequest={paymentRequest}
            setPaymentRequest={setPaymentRequest}
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
