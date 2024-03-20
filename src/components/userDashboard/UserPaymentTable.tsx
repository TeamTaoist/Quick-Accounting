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
      sx={{
        border: "1px solid var(--clr-gray-200)",
        borderRadius: "6px",
        maxHeight: "100%",
        overflow: "auto",
        minWidth: "1100px",
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
                fontWeight: "500",
                fontFamily: "Inter",
                color: "var(--clr-primary-900)",
              }}
            >
              Workspace
            </TableCell>
            <TableCell
              sx={{
                background: "var(--clr-gray-200)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: "var(--clr-primary-900)",
              }}
            >
              Recipient
            </TableCell>
            <TableCell
              sx={{
                background: "var(--clr-gray-200)",
                width: "25%",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: "var(--clr-primary-900)",
              }}
            >
              Amount
            </TableCell>
            <TableCell
              sx={{
                background: "var(--clr-gray-200)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: "var(--clr-primary-900)",
              }}
            >
              Status
            </TableCell>
            <TableCell
              sx={{
                background: "var(--clr-gray-200)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: "var(--clr-primary-900)",
              }}
            >
              Date
            </TableCell>
            <TableCell
              sx={{
                background: "var(--clr-gray-200)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Inter",
                color: "var(--clr-primary-900)",
              }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData.map((payment) => (
            <TableRow key={payment.ID}>
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
                <div>
                  <p>{payment.workspace_name}</p>
                  {/* <p>{getShortAddress(payment.vault_wallet)}</p> */}
                </div>
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
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
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
                {formatNumber(Number(payment.amount))} {payment.currency_name}
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
                {/* <img src={statusIcon} alt="" /> */}
                <Status status={getPaymentStatus(payment.status)}>
                  <p></p>
                  {getPaymentStatus(payment.status)}
                </Status>
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
                {getPaymentUpdateTime(payment)}
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
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
