import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  CategoryCell,
  Image,
  PaymentPagination,
  TableSection,
  ViewReject,
} from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import statusIcon from "../../../assets/workspace/status-icon.svg";
import details from "../../../assets/details.svg";
import styled from "@emotion/styled";
import CustomModal from "../../../utils/CustomModal";
import PaymentRequestDetails from "../../../pages/workspace/paymentRequest/PaymentRequestDetailsReadOnly";
import { useEffect, useState } from "react";
import usePaymentsStore from "../../../store/usePayments";
import { formatNumber } from "../../../utils/number";
import Pagination from "../../Pagination";
import { useWorkspace } from "../../../store/useWorkspace";
import { getPaymentStatus, getPaymentUpdateTime } from "../../../utils/payment";
import { getShortAddress } from "../../../utils";
import { useDomainStore } from "../../../store/useDomain";
import SearchInput from "../SearchInput";
import FilterCategorySelect from "../FilterCategorySelect";
import back from "../../../assets/workspace/back.svg";
import Button from "../../button";
import { Cell, HeaderCell, TableContainerSection } from "../../table";

interface RejectDataTableProps {
  searchTerm?: string | undefined;
  selectedValue?: string;
  isInQueue?: boolean;
  paymentRequest: boolean;
  setPaymentRequest: (paymentRequest: boolean) => void;
}

const RejectPaymentRequestTable = ({
  isInQueue,
  paymentRequest,
  setPaymentRequest,
}: RejectDataTableProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [list, setList] = useState<IPaymentRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNumbers, setPageNumbers] = useState(0);

  const {
    getFailedPaymentRequestList,
    setCurrentPaymentRequestDetail,
    paymentRequestDetails,
  } = usePaymentsStore();
  const { workspace, userWorkspaces } = useWorkspace();
  const { queryNameService, formatAddressToDomain } = useDomainStore();

  const [paymentId, setPaymentId] = useState<number | null>(null);
  const handleOpenModal = (payment: IPaymentRequest) => {
    setCurrentPaymentRequestDetail({
      ...payment,
      vault_wallet: workspace.vault_wallet,
    });
    setOpenModal(true);
  };

  // search payments
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchPayment = (e: any) => {
    e.preventDefault();
    // getPaymentRequestList(workspaceId, false, pageNumbers, 10, searchTerm).then(
    //   (res) => {
    //     setTotalItem(res);
    //     setIsSearch(true);
    //   }
    // );
  };
  useEffect(() => {
    // if (!searchTerm && isSearch) {
    //   getPaymentRequestList(
    //     workspaceId,
    //     false,
    //     pageNumbers,
    //     10,
    //     searchTerm
    //   ).then((res) => {
    //     setTotalItem(res);
    //     setIsSearch(false);
    //   });
    // }
  }, [searchTerm]);
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleDropdownChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  const uniqueCategoryNames = Array.from(
    new Set(list.map((payment) => payment.category_name))
  );
  // filter table data
  const filterData = searchTerm
    ? list.filter((data) => {
        const searchItem = data.counterparty
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const filterByCategory =
          selectedValue === "" || data.category_name === selectedValue;
        return searchItem && filterByCategory;
      })
    : list;

  useEffect(() => {
    getFailedPaymentRequestList(Number(id), isInQueue, pageNumbers).then(
      (res: IPageResponse<IPaymentRequest>) => {
        setTotal(res?.total || 0);
        setList(res?.rows || []);
      }
    );
  }, [isInQueue, pageNumbers]);

  // pagination
  // const pageSize = 10;
  // const totalItem = paymentPagination.total;

  const pageCount = Math.ceil(total / 10);

  const handlePageClick = (event: any) => {
    setPageNumbers(event.selected);
  };

  // const selectedWorkspace = userWorkspaces.data.rows.find(
  //   (workspace) => workspace.ID === paymentRequestDetails.workspace_id
  // );

  useEffect(() => {
    if (list.length && workspace.chain_id) {
      queryNameService(
        list,
        workspace.name_service === "sns",
        workspace.chain_id
      );
    }
  }, [list, workspace, queryNameService]);

  return (
    <div>
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestDetails}
      />
      <RejectHeader>
        <div>
          <SearchInput
            handleSearchPayment={handleSearchPayment}
            placeholder="Search token"
            searchTerm={searchTerm}
            handleChange={handleChange}
            width="300px"
          />
          <FilterCategorySelect
            selectedValue={selectedValue}
            handleDropdownChange={handleDropdownChange}
            uniqueCategoryNames={uniqueCategoryNames}
          />
        </div>
        <Button
          onClick={() => setPaymentRequest(true)}
          icon={back}
          width="89px"
        >
          Back
        </Button>
      </RejectHeader>
      <TableSection>
        <TableContainerSection>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <HeaderCell width="154px">Recipient</HeaderCell>
                <HeaderCell width="393px">Amount</HeaderCell>
                <HeaderCell width="180px">Category</HeaderCell>
                <HeaderCell width="137px">Status</HeaderCell>
                <HeaderCell width="176px">Date</HeaderCell>
                <HeaderCell width="96px"></HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData?.map((payment) => (
                <TableRow
                  key={payment.ID}
                  sx={{
                    height: "55px",
                  }}
                >
                  <Cell>
                    {formatAddressToDomain(
                      payment.counterparty,
                      workspace.chain_id,
                      workspace.name_service === "sns"
                    )}
                  </Cell>
                  <Cell>
                    {formatNumber(Number(payment.amount))}{" "}
                    {payment.currency_name}
                  </Cell>
                  <Cell>
                    <CategoryCell>{payment.category_name}</CategoryCell>
                  </Cell>
                  <Cell>
                    <Status status={getPaymentStatus(payment.status)}>
                      <p></p>
                      {getPaymentStatus(payment.status)}
                    </Status>
                  </Cell>
                  <Cell>{getPaymentUpdateTime(payment)}</Cell>
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
                        onClick={() => handleOpenModal(payment)}
                      />
                    </Tooltip>
                  </Cell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainerSection>
        {total > 10 && (
          <PaymentPagination>
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </PaymentPagination>
        )}
      </TableSection>
    </div>
  );
};

export default RejectPaymentRequestTable;

export const Status = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 5px;
  p {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ status }) => {
      switch (status) {
        case "Submitted":
          return "#16A34A";
        case "Rejected":
          return "#FACC15";
        case "Pending":
          return "#94A3B8";
        case "Failed":
          return "#DC2626";
        case "Executed":
          return "#2563EB";
        default:
          return "gray";
      }
    }};
  }
  img {
    width: 7px;
  }
`;
const RejectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  min-width: 1100px;
  div {
    display: flex;
  }
`;
