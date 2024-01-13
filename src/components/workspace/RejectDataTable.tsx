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

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};
const RejectDataTable = () => {
  const navigate = useNavigate();
  return (
    <div>
      <TableContainer component={Paper} sx={{ maxHeight: 600, minWidth: 800 }}>
        <Table stickyHeader>
          <TableHead sx={{ background: "var(--bg-primary)" }}>
            <TableRow>
              <TableCell sx={{ background: "none" }}>Recipient</TableCell>
              <TableCell sx={{ background: "none" }}>Amount</TableCell>
              <TableCell sx={{ background: "none" }}>Category</TableCell>
              <TableCell sx={{ background: "none" }}>Status</TableCell>
              <TableCell sx={{ background: "none" }}>Date</TableCell>
              <TableCell sx={{ background: "none" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{recipientFormate(row.recipient)}</TableCell>
                <TableCell>{row.amount} USDT</TableCell>
                <TableCell>
                  <CategoryCell>{row.category}</CategoryCell>
                </TableCell>
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
