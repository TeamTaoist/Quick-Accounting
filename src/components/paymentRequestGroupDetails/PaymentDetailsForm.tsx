import React from "react";
import {
  FormControl,
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
import arrowBottom from "../../assets/workspace/arrow-bottom.svg";
import { useWorkspace } from "../../store/useWorkspace";
import { formatBalance } from "../../utils/number";

interface PaymentDetailsFormProps {
  value: SharePaymentRequestBody;
  handleFormChange: (
    index: number,
    field: string,
    value: any,
    propertyName?: string,
    propertyType?: string,
    categoryId?: number
  ) => void;
  index: number;
  isEditable: boolean;
  sharePaymentRequestForm: SharePaymentRequestBody[];
}

const PaymentDetailsForm = ({
  handleFormChange,
  value,
  index,
  isEditable,
  sharePaymentRequestForm,
}: PaymentDetailsFormProps) => {
  const { assetsList } = useWorkspace();
  return (
    <TableContainer
      sx={{
        boxShadow: "none",
        border: "1px solid var(--border-table)",
        borderTopRightRadius: "6px",
        borderTopLeftRadius: "6px",
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ background: "var(--bg-secondary)" }}>
          <TableRow>
            <TableCell
              sx={{
                width: "30%",
                borderRight: "1px solid var(--border-table)",
                // paddingInline: 0,
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Recipient
            </TableCell>
            <TableCell
              sx={{
                width: "23%",
                borderRight: "1px solid var(--border-table)",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Amount
            </TableCell>
            <TableCell
              sx={{
                width: "37%",
                fontSize: "18px",
                fontWeight: "500",
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
                borderRight: "1px solid var(--border-table)",
                padding: 0,
                // paddingInline: "16px",
              }}
            >
              <TextField
                sx={{
                  "& fieldset": { border: "none" },
                }}
                size="small"
                fullWidth
                autoComplete="off"
                // id="fullWidth"
                placeholder="Enter wallet address"
                value={value.recipient}
                onChange={(e) =>
                  handleFormChange(index, "recipient", e.target.value)
                }
                InputProps={{
                  style: { padding: 0 },
                  readOnly: isEditable,
                }}
              />
            </TableCell>
            <TableCell
              sx={{
                borderRight: "1px solid var(--border-table)",
                borderRadius: "5px",
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
                fullWidth
                autoComplete="off"
                value={value.amount}
                // id="fullWidth"
                placeholder="amount"
                onChange={(e) =>
                  handleFormChange(index, "amount", e.target.value)
                }
                InputProps={{
                  style: { padding: 0 },
                  readOnly: isEditable,
                }}
              />
            </TableCell>
            <TableCell
              sx={{
                padding: 0,
                // minHeight: "40px",
              }}
            >
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={sharePaymentRequestForm[index].currency_contract_address}
                // onChange={handleChange}
                size="small"
                onChange={(e) =>
                  handleFormChange(index, "currency_address", e.target.value)
                }
                IconComponent={() => (
                  <InputAdornment position="start">
                    <img
                      src={arrowBottom}
                      alt="Custom Arrow Icon"
                      style={{ marginRight: "50px" }}
                    />
                  </InputAdornment>
                )}
                sx={{
                  width: "100%",
                  "& fieldset": { border: "none" },
                }}
                inputProps={{
                  readOnly: isEditable,
                }}
              >
                {assetsList.map(
                  (asset, i) =>
                    !asset.hidden && (
                      <MenuItem
                        key={i}
                        value={asset.tokenInfo.address}
                        disabled={asset.hidden}
                        sx={{
                          "&:hover": {
                            backgroundColor: "var(--hover-bg)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "var(--hover-bg)",
                          },
                        }}
                      >
                        {asset.tokenInfo.symbol}(
                        {formatBalance(asset.balance, asset.tokenInfo.decimals)}
                        )
                      </MenuItem>
                    )
                )}
              </Select>
            </TableCell>
          </TableRow>
          {/* ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentDetailsForm;
