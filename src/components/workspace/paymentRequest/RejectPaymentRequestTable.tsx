import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
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

interface RejectDataTableProps {
  searchTerm?: string | undefined;
  selectedValue?: string;
  isInQueue?: boolean;
}

const RejectPaymentRequestTable = ({ isInQueue }: RejectDataTableProps) => {
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
        <BackBtn>
          <Image src={back} alt="" />
          <p>Back</p>
        </BackBtn>
      </RejectHeader>
      <TableSection>
        <TableContainer
          sx={{
            border: "1px solid #ddd",
            borderRadius: "8px",
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
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "var(--clr-gray-200)",
                  }}
                >
                  Recipient
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "var(--clr-gray-200)",
                  }}
                >
                  Amount
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "var(--clr-gray-200)",
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "var(--clr-gray-200)",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "var(--clr-gray-200)",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "var(--clr-gray-200)",
                  }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData?.map((payment) => (
                <TableRow key={payment.ID}>
                  <TableCell>
                    {formatAddressToDomain(
                      payment.counterparty,
                      workspace.chain_id,
                      workspace.name_service === "sns"
                    )}
                  </TableCell>
                  <TableCell>
                    {formatNumber(Number(payment.amount))}{" "}
                    {payment.currency_name}
                  </TableCell>
                  <TableCell>
                    <CategoryCell>{payment.category_name}</CategoryCell>
                  </TableCell>
                  <TableCell>
                    <Status status={getPaymentStatus(payment.status)}>
                      <p></p>
                      {getPaymentStatus(payment.status)}
                    </Status>
                  </TableCell>
                  <TableCell>{getPaymentUpdateTime(payment)}</TableCell>
                  <TableCell>
                    {/* <Button
                      variant="outlined"
                      sx={{
                        borderColor: "black",
                        color: "black",
                        textTransform: "lowercase",
                      }}
                      onClick={() => handleOpenModal(payment)}
                    >
                      view more
                    </Button> */}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
  div {
    display: flex;
  }
`;
const BackBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--clr-gray-300);
  padding-inline: 8px;
  border-radius: 6px;
`;
