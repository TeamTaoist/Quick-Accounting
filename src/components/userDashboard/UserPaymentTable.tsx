import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";
import { formatNumber } from "../../utils/number";
import { Status } from "../workspace/paymentRequest/RejectPaymentRequestTable";
import details from "../../assets/details.svg";
import { getPaymentStatus, getPaymentUpdateTime } from "../../utils/payment";
import { useDomainStore } from "../../store/useDomain";

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
                background: "var(--clr-gray-200)",
                width: "25%",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Workspace
            </TableCell>
            <TableCell
              sx={{
                background: "var(--clr-gray-200)",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Recipient
            </TableCell>
            <TableCell
              sx={{
                background: "var(--clr-gray-200)",
                width: "25%",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Amount
            </TableCell>
            <TableCell
              sx={{
                background: "var(--clr-gray-200)",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Status
            </TableCell>
            <TableCell
              sx={{
                background: "var(--clr-gray-200)",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Date
            </TableCell>
            <TableCell
              sx={{
                background: "var(--clr-gray-200)",
                fontSize: "14px",
                fontWeight: "600",
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
                  {/* <p>{getShortAddress(payment.vault_wallet)}</p> */}
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
                {/* <img src={statusIcon} alt="" /> */}
                <Status status={getPaymentStatus(payment.status)}>
                  <p></p>
                  {getPaymentStatus(payment.status)}
                </Status>
              </TableCell>
              <TableCell>{getPaymentUpdateTime(payment)}</TableCell>
              <TableCell>
                <Tooltip
                  title="View details"
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        background: "var(--clr-white)",
                        color: "#111",
                        border: "1px solid var(--clr-gray-200)",
                        padding: "8px 16px",
                        fontSize: "12px",
                      },
                    },
                  }}
                >
                  <img
                    src={details}
                    alt=""
                    style={{ width: "16px" }}
                    onClick={() => handleUserPaymentDetails(payment)}
                  />
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserPaymentTable;
