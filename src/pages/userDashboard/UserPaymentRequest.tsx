import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import data from "../../data/tableData";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import searchIcon from "../../assets/workspace/search-icon.svg";
import statusIcon from "../../assets/workspace/status-icon.svg";
import { Status } from "../../components/workspace/RejectDataTable";
import CustomModal from "../../utils/CustomModal";
import PaymentRequestDetails from "../workspace/paymentRequest/PaymentRequestDetails";
import { useUserPayment } from "../../store/useUserPayment";
import usePaymentsStore from "../../store/usePayments";

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};

const UserPaymentRequest = () => {
  const { id } = useParams();
  const { userPayment } = useUserPayment();
  const { getPaymentRequestDetails } = usePaymentsStore();

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // filter table data
  const filterData = userPayment.filter((payment) =>
    payment.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (
    workspaceId: number,
    paymentRequestId: number,
    paymentId: number
  ) => {
    setOpenModal(true);
    getPaymentRequestDetails(workspaceId, paymentRequestId, paymentId);
  };
  const paymentStatus = (status: number) => {
    if (status === 0) {
      return "Pending";
    }
    if (status === 1) {
      return "Rejected";
    } else {
      return "Executed";
    }
  };
  return (
    <UserPaymentContainer>
      {/* modal */}
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestDetails}
      />
      <TextField
        id="search"
        type="search"
        placeholder="Search Token"
        value={searchTerm}
        onChange={handleChange}
        sx={{ width: 350 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src={searchIcon} alt="" />
            </InputAdornment>
          ),
        }}
      />
      <PaymentLIst>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 600, minWidth: 800 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Safe</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData.map((payment) => (
                <TableRow key={payment.ID}>
                  <TableCell>
                    <Safe>
                      <p>{payment.category_name}</p>
                      <p>{recipientFormate(payment.recipient)}</p>
                    </Safe>
                  </TableCell>
                  <TableCell>{payment.amount} USDT</TableCell>
                  <TableCell>
                    <Status>
                      <img src={statusIcon} alt="" />
                      {paymentStatus(payment.status)}
                    </Status>
                  </TableCell>
                  <TableCell>{payment.CreatedAt}</TableCell>
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
                          payment.workspace_id,
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
            </TableBody>
          </Table>
        </TableContainer>
      </PaymentLIst>
    </UserPaymentContainer>
  );
};

export default UserPaymentRequest;

const UserPaymentContainer = styled.div`
  padding-inline: 30px;
  margin-top: 47px;
  flex: 1;
`;
const PaymentLIst = styled.div`
  margin-top: 140px;
`;
const Safe = styled.div`
  /* display: flex; */
`;
