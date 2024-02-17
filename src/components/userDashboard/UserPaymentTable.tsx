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
import { formatNumber } from "../../utils/number";
import { Status } from "../workspace/paymentRequest/RejectPaymentRequestTable";
import statusIcon from "../../assets/workspace/status-icon.svg";
import { getPaymentStatus } from "../../utils/payment";

interface UserPaymentTableProps {
  filterData: IPaymentRequest[];
  handleUserPaymentDetails: (data: IPaymentRequest) => void;
}

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};
const UserPaymentTable = ({
  filterData,
  handleUserPaymentDetails,
}: UserPaymentTableProps) => {
  return (
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
                <div>
                  <p>{payment.workspace_name}</p>
                  <p>{recipientFormate(payment.vault_wallet)}</p>
                </div>
              </TableCell>
              <TableCell>
                {formatNumber(Number(payment.amount))} {payment.currency_name}
              </TableCell>
              <TableCell>
                <Status>
                  <img src={statusIcon} alt="" />
                  {getPaymentStatus(payment.status)}
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
                  onClick={() => handleUserPaymentDetails(payment)}
                >
                  view more
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserPaymentTable;
