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
import PaymentRequestDetails from "../workspace/paymentRequest/PaymentRequestDetailsReadOnly";
import { useUserPayment } from "../../store/useUserPayment";
import usePaymentsStore from "../../store/usePayments";
import { formatNumber } from "../../utils/number";

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};

const UserPaymentRequest = () => {
  const { id } = useParams();
  const { userPayment, getUserPayment } = useUserPayment();
  const { setCurrentPaymentRequestDetail } = usePaymentsStore();

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // filter table data
  const filterData = userPayment.rows.filter(
    (payment) =>
      payment.workspace_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vault_wallet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (data: IPaymentRequest) => {
    setCurrentPaymentRequestDetail(data);
    setOpenModal(true);
  };
  const paymentStatus = (status: number) => {
    if (status === 0) {
      return "Draft";
    } else if (status === 1) {
      return "Submitted";
    } else if (status === 2) {
      return "Rejected";
    } else if (status === 3) {
      return "Pending";
    } else if (status === 4) {
      return "Failed";
    } else if (status === 5) {
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
        autoComplete="off"
        placeholder="Search workspace name"
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
          sx={{
            maxHeight: 600,
            minWidth: 800,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            scrollbarWidth: "none",
          }}
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
                      <p>{payment.workspace_name}</p>
                      <p>{recipientFormate(payment.vault_wallet)}</p>
                    </Safe>
                  </TableCell>
                  <TableCell>
                    {formatNumber(Number(payment.amount))}{" "}
                    {payment.currency_name}
                  </TableCell>
                  <TableCell>
                    <Status>
                      <img src={statusIcon} alt="" />
                      {paymentStatus(payment.status)}
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
  margin-top: 60px;
`;
const Safe = styled.div`
  /* display: flex; */
`;
