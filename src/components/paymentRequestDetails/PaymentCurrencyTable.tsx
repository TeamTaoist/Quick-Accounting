import {
  InputAdornment,
  MenuItem,
  Select,
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
import arrowBottom from "../../assets/workspace/arrow-bottom.svg";
import { Cell, HeaderCell } from "../table";

const PaymentCurrencyTable = () => {
  const { paymentRequestDetails } = usePaymentsStore();
  const { formatAddressToDomain } = useDomainStore();
  const { workspace } = useWorkspace();
  const { pathname } = useLocation();

  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow
          sx={{ "& .MuiTableCell-root": { background: "var(--clr-gray-100)" } }}
        >
          <HeaderCell width="280px" color="#0f172a">
            Recipient
          </HeaderCell>
          <HeaderCell width="220px" color="#0f172a">
            Amount
          </HeaderCell>
          <HeaderCell width="220px" color="#0f172a">
            Currency
          </HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <Cell>
            <TextField
              sx={{
                "& input": {
                  padding: 0,
                  fontSize: "14px",
                },
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
          </Cell>
          <Cell>
            <TextField
              sx={{
                "& input": {
                  padding: 0,
                  fontSize: "14px",
                },
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
          </Cell>
          <Cell>
            <TextField
              sx={{
                "& input": {
                  padding: 0,
                  fontSize: "14px",
                },
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
          </Cell>
        </TableRow>
      </TableBody>
    </Table>
    // </TableContainer>
  );
};

export default PaymentCurrencyTable;
