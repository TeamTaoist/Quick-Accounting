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
import PaymentRequestDetails from "../../../pages/workspace/paymentRequest/PaymentRequestDetails";
import { useEffect, useState } from "react";
import usePaymentsStore from "../../../store/usePayments";
import { formatNumber } from "../../../utils/number";
import Pagination from "../../Pagination";

interface RejectDataTableProps {
  searchTerm?: string | undefined;
  selectedValue?: string;
  isInQueue?: boolean;
}
const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};
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

  const { getFailedPaymentRequestList } = usePaymentsStore();

  const [paymentId, setPaymentId] = useState<number | null>(null);
  const handleOpenModal = (paymentId: number) => {
    setPaymentId(paymentId);
    setOpenModal(true);
  };
  // filter table data
  const filterData = searchTerm
    ? list.filter((data) => {
        const searchItem = data.recipient
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

  return (
    <div>
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestDetails}
        additionalProps={{ paymentId, data: list }}
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
                  <TableCell>{recipientFormate(payment.recipient)}</TableCell>
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
                  <TableCell>{payment.CreatedAt.slice(0, 10)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "black",
                        color: "black",
                        textTransform: "lowercase",
                      }}
                      onClick={() => handleOpenModal(payment.ID)}
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
