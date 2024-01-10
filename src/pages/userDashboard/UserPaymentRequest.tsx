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
import { useState } from "react";
import searchIcon from "../../assets/workspace/search-icon.svg";

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};

const UserPaymentRequest = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
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
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Safe>
                      <p>{row.workspaceName}</p>
                      <p>{recipientFormate(row.recipient)}</p>
                    </Safe>
                  </TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "black",
                        color: "black",
                        textTransform: "lowercase",
                      }}
                      onClick={() => navigate(`/payment-request/${row.id}`)}
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
