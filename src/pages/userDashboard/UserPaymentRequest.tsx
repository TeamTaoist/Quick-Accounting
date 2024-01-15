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
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import searchIcon from "../../assets/workspace/search-icon.svg";
import statusIcon from "../../assets/workspace/status-icon.svg";
import { Status } from "../../components/workspace/RejectDataTable";
import CustomModal from "../../utils/CustomModal";
import PaymentRequestDetails from "../workspace/paymentRequest/PaymentRequestDetails";
import { useUserPayment } from "../../store/useUserPayment";

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};

const UserPaymentRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // filter table data
  const filterData = data.filter((d) =>
    d.workspaceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  return (
    <UserPaymentContainer>
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
              {filterData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Safe>
                      <p>{row.workspaceName}</p>
                      <p>{recipientFormate(row.recipient)}</p>
                    </Safe>
                  </TableCell>
                  <TableCell>{row.amount} USDT</TableCell>
                  <TableCell>
                    <Status>
                      <img src={statusIcon} alt="" />
                      {row.status}
                    </Status>
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
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
                    {/* modal */}
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
