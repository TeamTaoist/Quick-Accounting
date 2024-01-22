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
import data from "../../data/tableData";
import { useNavigate } from "react-router-dom";
import { CategoryCell } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import statusIcon from "../../assets/workspace/status-icon.svg";
import styled from "@emotion/styled";
import CustomModal from "../../utils/CustomModal";
import PaymentRequestDetails from "../../pages/workspace/paymentRequest/PaymentRequestDetails";
import { useState } from "react";
import usePaymentsStore from "../../store/usePayments";

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};
const RejectDataTable = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const { paymentRequestList } = usePaymentsStore();

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  return (
    <div>
      <TableContainer component={Paper} sx={{ maxHeight: 600, minWidth: 800 }}>
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
            {paymentRequestList?.map((payment) => (
              <TableRow key={payment.ID}>
                <TableCell>{recipientFormate(payment.recipient)}</TableCell>
                <TableCell>{payment.amount} USDT</TableCell>
                <TableCell>
                  <CategoryCell>{payment.category_name}</CategoryCell>
                </TableCell>
                <TableCell>
                  <Status>
                    <img src={statusIcon} alt="" />
                    {payment.status === 1 && "Rejected"}
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
                    onClick={handleOpenModal}
                  >
                    view more
                  </Button>
                  <CustomModal
                    open={openModal}
                    setOpen={setOpenModal}
                    component={PaymentRequestDetails}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RejectDataTable;

export const Status = styled.div`
  display: flex;
  gap: 5px;
  img {
    width: 7px;
  }
`;
