import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import usePaymentsStore from "../../store/usePayments";
import { useDomainStore } from "../../store/useDomain";
import { useWorkspace } from "../../store/useWorkspace";
import { useLocation } from "react-router-dom";

const PaymentCurrencyTable = () => {
  const { paymentRequestDetails } = usePaymentsStore();
  const { formatAddressToDomain } = useDomainStore();
  const { workspace } = useWorkspace();
  const { pathname } = useLocation();

  return (
    // <TableContainer sx={{ paddingInline: "40px", paddingTop: "30px" }}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead sx={{ backgroundColor: "var(--bg-secondary)" }}>
        <TableRow>
          <TableCell
            sx={{
              // width: 200,
              width: "30.2%",
              border: 0,
              borderRight: "1px solid var(--border-table)",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            Recipient
          </TableCell>
          <TableCell
            sx={{
              width: 150,
              border: 0,
              borderRight: "1px solid var(--border-table)",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            Amount
          </TableCell>
          <TableCell
            sx={{
              width: 200,
              border: 0,
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            Currency
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow
          sx={{
            height: "30px",
          }}
        >
          <TableCell
            // size="small"
            sx={{
              border: "1px solid var(--border-table)",
              padding: 0,
              borderLeft: 0,
            }}
          >
            <TextField
              sx={{
                "& fieldset": { border: "none" },
              }}
              size="small"
              value={formatAddressToDomain(
                paymentRequestDetails?.counterparty,
                paymentRequestDetails.workspace_chain_id || workspace.chain_id,
                pathname.startsWith("/user")
                  ? paymentRequestDetails.name_service === "sns"
                  : workspace.name_service === "sns"
              )}
              fullWidth
              // id="fullWidth"
              placeholder="Enter wallet address"
              InputProps={{
                style: { padding: 0 },
                readOnly: true,
              }}
            />
          </TableCell>
          <TableCell
            sx={{
              border: "1px solid var(--border-table)",
              padding: 0,
              paddingLeft: "10px",
              // minHeight: "40px",
            }}
          >
            <TextField
              sx={{
                "& fieldset": { border: "none" },
              }}
              size="small"
              value={paymentRequestDetails?.amount}
              fullWidth
              // id="fullWidth"
              placeholder="Enter wallet address"
              InputProps={{
                style: { padding: 0 },
                readOnly: true,
              }}
            />
          </TableCell>
          <TableCell
            sx={{
              border: "1px solid var(--border-table)",
              borderRight: 0,
              padding: 0,
            }}
          >
            <TextField
              sx={{
                "& fieldset": { border: "none" },
              }}
              size="small"
              value={paymentRequestDetails?.currency_name}
              fullWidth
              // id="fullWidth"
              placeholder="Enter wallet address"
              InputProps={{
                style: { padding: 0 },
                readOnly: true,
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    // </TableContainer>
  );
};

export default PaymentCurrencyTable;
