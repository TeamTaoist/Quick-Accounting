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
import { getShortAddress } from "../../utils";

const PaymentCurrencyTable = () => {
  const { paymentRequestDetails } = usePaymentsStore();
  return (
    <TableContainer sx={{ paddingInline: "40px", paddingTop: "30px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                width: 200,
                border: 0,
                paddingInline: 0,
              }}
            >
              Recipient
            </TableCell>
            <TableCell sx={{ width: 150, border: 0, paddingInline: 0 }}>
              Amount
            </TableCell>
            <TableCell sx={{ width: 200, border: 0, paddingInline: 0 }}>
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
              }}
            >
              <TextField
                sx={{
                  "& fieldset": { border: "none" },
                }}
                size="small"
                value={getShortAddress(paymentRequestDetails?.counterparty)}
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
    </TableContainer>
  );
};

export default PaymentCurrencyTable;
