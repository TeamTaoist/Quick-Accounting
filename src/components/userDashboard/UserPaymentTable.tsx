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
import { getPaymentStatus, getPaymentUpdateTime } from "../../utils/payment";
import { useDomainStore } from "../../store/useDomain";
import { getShortAddress } from "../../utils";

interface UserPaymentTableProps {
  filterData: IPaymentRequest[];
  handleUserPaymentDetails: (data: IPaymentRequest) => void;
}

const UserPaymentTable = ({
  filterData,
  handleUserPaymentDetails,
}: UserPaymentTableProps) => {
  const { formatAddressToDomain } = useDomainStore();
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "100%",
        overflow: "auto",
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
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            >
              Safe
            </TableCell>
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            >
              Recipient
            </TableCell>
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            >
              Amount
            </TableCell>
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            >
              Status
            </TableCell>
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            >
              Date
            </TableCell>
            <TableCell
              sx={{
                background: "var(--bg-primary)",
              }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData.map((payment) => (
            <TableRow key={payment.ID}>
              <TableCell>
                <div>
                  <p>{payment.workspace_name}</p>
                  <p>{getShortAddress(payment.vault_wallet)}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p>
                    {formatAddressToDomain(
                      payment.counterparty,
                      payment.workspace_chain_id,
                      payment.name_service === "sns"
                    )}
                  </p>
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
              <TableCell>{getPaymentUpdateTime(payment)}</TableCell>
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
