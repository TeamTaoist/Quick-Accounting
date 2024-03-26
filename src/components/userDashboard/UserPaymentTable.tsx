import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  TableCellProps,
} from "@mui/material";
import { formatNumber } from "../../utils/number";
import { Status } from "../workspace/paymentRequest/RejectPaymentRequestTable";
import details from "../../assets/details.svg";
import { getPaymentStatus, getPaymentUpdateTime } from "../../utils/payment";
import { useDomainStore } from "../../store/useDomain";

interface CustomTableCellProps extends TableCellProps {
  width?: string;
}

const HeaderCell = ({ width, children, ...props }: CustomTableCellProps) => (
  <TableCell
    sx={{
      background: "var(--clr-gray-200)",
      fontWeight: "500",
      color: "var(--clr-primary-900)",
      height: "56px",
      padding: 0,
      paddingInline: 2,
      minWidth: width ? width : "auto",
    }}
    {...props}
  >
    {children}
  </TableCell>
);
const Cell = ({ children }: { children: React.ReactNode }) => (
  <TableCell
    sx={{
      borderBottom: "none",
      borderTop: "1px solid var(--clr-gray-200)",
      padding: 0,
      paddingInline: 2,
      height: "56px",
    }}
  >
    {children}
  </TableCell>
);
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
        minWidth: "1136px",
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
            <HeaderCell width="286px">Workspace</HeaderCell>
            <HeaderCell width="154px">Recipient</HeaderCell>
            <HeaderCell width="286px">Amount</HeaderCell>
            <HeaderCell width="237px">Status</HeaderCell>
            <HeaderCell width="176px">Date</HeaderCell>
            <HeaderCell width="96px"></HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData.map((payment) => (
            <TableRow key={payment.ID}>
              <Cell>
                <div>
                  <p>{payment.workspace_name}</p>
                  {/* <p>{getShortAddress(payment.vault_wallet)}</p> */}
                </div>
              </Cell>
              <Cell>
                <div>
                  <p>
                    {formatAddressToDomain(
                      payment.counterparty,
                      payment.workspace_chain_id,
                      payment.name_service === "sns"
                    )}
                  </p>
                </div>
              </Cell>
              <Cell>
                {formatNumber(Number(payment.amount))} {payment.currency_name}
              </Cell>
              <Cell>
                {/* <img src={statusIcon} alt="" /> */}
                <Status status={getPaymentStatus(payment.status)}>
                  <p></p>
                  {getPaymentStatus(payment.status)}
                </Status>
              </Cell>
              <Cell>{getPaymentUpdateTime(payment)}</Cell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                  display: "grid",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 0,
                  paddingInline: 2,
                  height: "56px",
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
