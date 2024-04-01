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
        <TableRow>
          <HeaderCell width="280px">Recipient</HeaderCell>
          <HeaderCell width="220px">Amount</HeaderCell>
          <HeaderCell width="220px">Currency</HeaderCell>
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
            <Select
              readOnly={true}
              labelId=""
              variant="outlined"
              id={`dropdown`}
              value={paymentRequestDetails?.currency_name}
              // onChange={(e) =>
              //   handleServiceChange(e, index, "currency")
              // }
              size="small"
              IconComponent={() => (
                <InputAdornment position="start">
                  <img
                    src={arrowBottom}
                    alt="Custom Arrow Icon"
                    style={{ marginRight: "8px", width: "16px" }}
                  />
                </InputAdornment>
              )}
              sx={{
                minWidth: "100%",
                height: "36px",
                marginRight: "8px",
                // .css-q8hpuo-MuiFormControl-root
                "& .MuiSelect-select": {
                  display: "block",
                  fontSize: "14px",
                },
                "&.MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--clr-gray-200)",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--clr-gray-200)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--clr-gray-200)",
                  },
                },
              }}
            >
              {/* {assetsList?.map(
                            (item, i) =>
                              !item.hidden && ( */}
              <MenuItem
                // key={i}
                value={paymentRequestDetails?.currency_name}
                sx={{
                  "&:hover": {
                    backgroundColor: "var(--clr-gray-100)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "var(--clr-gray-200)",
                  },
                }}
              >
                {paymentRequestDetails?.currency_name}
              </MenuItem>
              {/* )
                          )} */}
            </Select>
          </Cell>
        </TableRow>
      </TableBody>
    </Table>
    // </TableContainer>
  );
};

export default PaymentCurrencyTable;
