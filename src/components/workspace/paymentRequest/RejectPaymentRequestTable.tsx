import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  CategoryCell,
  PaymentPagination,
  TableSection,
} from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import statusIcon from "../../../assets/workspace/status-icon.svg";
import styled from "@emotion/styled";
import CustomModal from "../../../utils/CustomModal";
import PaymentRequestDetails from "../../../pages/workspace/paymentRequest/PaymentRequestDetailsReadOnly";
import { useEffect, useState } from "react";
import usePaymentsStore from "../../../store/usePayments";
import { formatNumber } from "../../../utils/number";
import Pagination from "../../Pagination";
import { useWorkspace } from "../../../store/useWorkspace";
import { getPaymentUpdateTime } from "../../../utils/payment";
import { getShortAddress } from "../../../utils";
import { useDomainStore } from "../../../store/useDomain";

interface RejectDataTableProps {
  searchTerm?: string | undefined;
  selectedValue?: string;
  isInQueue?: boolean;
}

const RejectPaymentRequestTable = ({
  searchTerm,
  selectedValue,
  isInQueue,
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
  const { queryENS, formatAddressToDomain } = useDomainStore();

  const [paymentId, setPaymentId] = useState<number | null>(null);
  const handleOpenModal = (payment: IPaymentRequest) => {
    setCurrentPaymentRequestDetail({
      ...payment,
      vault_wallet: workspace.vault_wallet,
    });
    setOpenModal(true);
  };
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
    const wallets = list.map((p) => p.counterparty);
    if (wallets.length && workspace.chain_id) {
      queryENS(wallets, workspace.chain_id);
    }
  }, [list, workspace]);

  return (
    <div>
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestDetails}
      />
      <TableSection>
        <TableContainer
          component={Paper}
          sx={{
            minWidth: 800,
            borderRadius: "10px",
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
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
                  Status
                </TableCell>
                <TableCell sx={{ background: "var(--bg-primary)" }}>
                  Date
                </TableCell>
                <TableCell sx={{ background: "var(--bg-primary)" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData?.map((payment) => (
                <TableRow key={payment.ID}>
                  <TableCell>
                    {formatAddressToDomain(
                      payment.counterparty,
                      workspace.chain_id
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
                    <Status>
                      <img src={statusIcon} alt="" />
                      {"Rejected"}
                    </Status>
                  </TableCell>
                  <TableCell>{getPaymentUpdateTime(payment)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "black",
                        color: "black",
                        textTransform: "lowercase",
                      }}
                      onClick={() => handleOpenModal(payment)}
                    >
                      view more
                    </Button>
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

export const Status = styled.div`
  display: flex;
  gap: 5px;
  img {
    width: 7px;
  }
`;
