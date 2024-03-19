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
import styled from "@emotion/styled";
const HeaderStyles = {
  padding: "10px 15px",
  fontFamily: "Inter",
  fontSize: "16px",
  fontWeight: "500",
  color: "#0F172A",
};

const PaymentCurrencyTable = () => {
  const { paymentRequestDetails } = usePaymentsStore();
  const { formatAddressToDomain } = useDomainStore();
  const { workspace } = useWorkspace();
  const { pathname } = useLocation();

  return (
    // <TableContainer sx={{ paddingInline: "40px", paddingTop: "30px" }}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead sx={{ backgroundColor: "var(--clr-gray-200)" }}>
        <TableRow>
          <TableCell sx={HeaderStyles}>Recipient</TableCell>
          <TableCell sx={HeaderStyles}>Amount</TableCell>
          <TableCell sx={HeaderStyles}>Currency</TableCell>
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
              // border: "1px solid var(--border-table)",
              border: 0,
              padding: "5px",
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
              border: 0,
              padding: "5px",
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
              border: 0,
              padding: "5px",
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
