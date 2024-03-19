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

const HeaderStyles = {
  padding: "10px 15px",
  fontFamily: "Inter",
  fontSize: "16px",
  fontWeight: "500",
  color: "#0F172A",
  width: "33%",
};

const PaymentCurrencyTable = () => {
  const { paymentRequestDetails } = usePaymentsStore();
  const { formatAddressToDomain } = useDomainStore();
  const { workspace } = useWorkspace();
  const { pathname } = useLocation();

  return (
    // <TableContainer sx={{ paddingInline: "40px", paddingTop: "30px" }}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead
        sx={{ backgroundColor: "var(--clr-gray-200)", height: "56px" }}
      >
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
              // padding: "5px",
              padding: "5px 0",
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
              padding: "5px 0",
              // padding: "5px 10px",
              // paddingInline: "15px",
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
              padding: "5px 0",
              paddingRight: "16px",
            }}
          >
            {/* <TextField
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
            /> */}
            <Select
              readOnly={paymentRequestDetails?.status === 2}
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
                    style={{ marginRight: "20px", width: "10px" }}
                  />
                </InputAdornment>
              )}
              sx={{
                minWidth: "100%",
                height: "40px",
                marginRight: "8px",
                // .css-q8hpuo-MuiFormControl-root
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
                // "& fieldset": { border: "1px solid red" },
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
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    // </TableContainer>
  );
};

export default PaymentCurrencyTable;
