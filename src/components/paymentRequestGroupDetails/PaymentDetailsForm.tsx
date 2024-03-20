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
import { PaymentRequestInput } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";

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
        border: "1px solid var(--clr-gray-200)",
        borderTopRightRadius: "6px",
        borderTopLeftRadius: "6px",
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead
          sx={{ backgroundColor: "var(--clr-gray-200)", height: "56px" }}
        >
          <TableRow>
            <TableCell
              sx={{
                width: "35%",
                padding: "10px 15px",
                fontFamily: "Inter",
                fontSize: "16px",
                fontWeight: "500",
                color: "#0F172A",
              }}
            >
              Recipient
            </TableCell>
            <TableCell
              sx={{
                width: "23%",
                padding: "10px 15px",
                fontFamily: "Inter",
                fontSize: "16px",
                fontWeight: "500",
                color: "#0F172A",
              }}
            >
              Amount
            </TableCell>
            <TableCell
              sx={{
                width: "37%",
                padding: "10px 15px",
                fontFamily: "Inter",
                fontSize: "16px",
                fontWeight: "500",
                color: "#0F172A",
              }}
            >
              Currency
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{
              height: "55px",
            }}
          >
            <TableCell
              // size="small"
              sx={{
                padding: "0 16px",
                border: 0,
                // paddingInline: "16px",
              }}
            >
              {/* <TextField
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
              /> */}
              <PaymentRequestInput
                placeholder="Enter wallet address"
                value={value.recipient}
                onChange={(e) =>
                  handleFormChange(index, "recipient", e.target.value)
                }
              />
            </TableCell>
            <TableCell
              sx={{
                padding: "0 16px",
                border: 0,
              }}
            >
              {/* <TextField
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
              /> */}
              <PaymentRequestInput
                placeholder="0.00"
                value={value.amount}
                onChange={(e) =>
                  handleFormChange(index, "amount", e.target.value)
                }
              />
            </TableCell>
            <TableCell
              sx={{
                padding: "0 16px",
                border: 0,
                // minHeight: "40px",
              }}
            >
              {/* <Select
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
              </Select> */}
              <Select
                labelId={`dropdown-${index}-label`}
                variant="outlined"
                id={`dropdown-${index}`}
                value={sharePaymentRequestForm[index].currency_contract_address}
                onChange={(e) =>
                  handleFormChange(index, "currency_address", e.target.value)
                }
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
                {assetsList?.map(
                  (item, i) =>
                    !item.hidden && (
                      <MenuItem
                        key={i}
                        value={item.tokenInfo.address}
                        sx={{
                          "&:hover": {
                            backgroundColor: "var(--clr-gray-100)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "var(--clr-gray-200)",
                          },
                        }}
                      >
                        {item.tokenInfo.symbol}(
                        {formatBalance(item.balance, item.tokenInfo.decimals)})
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
