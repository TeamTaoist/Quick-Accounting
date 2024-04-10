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
import { Cell, HeaderCell } from "../table";

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
const CategoryDropdownStyle = {
  overflow: "hidden",
  width: "190px",
  height: "42px",
  padding: 0,
  paddingInline: "1px",
  "& .MuiSelect-select": {
    display: "block",
    fontSize: "14px",
  },
  "&.MuiOutlinedInput-root": {
    border: "1px solid var(--clr-gray-200)",
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  "& .MuiInputLabel-root": { display: "none" },
};

const PaymentDetailsForm = ({
  handleFormChange,
  value,
  index,
  isEditable,
  sharePaymentRequestForm,
}: PaymentDetailsFormProps) => {
  const { assetsList } = useWorkspace();
  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <HeaderCell width="260px" color="#0f172a">
            Recipient
          </HeaderCell>
          <HeaderCell width="230px" color="#0f172a">
            Amount
          </HeaderCell>
          <HeaderCell width="230px" color="#0f172a">
            Currency
          </HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <Cell>
            <PaymentRequestInput
              placeholder="Enter wallet address"
              value={value.recipient}
              onChange={(e) =>
                handleFormChange(index, "recipient", e.target.value)
              }
            />
          </Cell>
          <Cell>
            <PaymentRequestInput
              placeholder="0.00"
              value={value.amount}
              onChange={(e) =>
                handleFormChange(index, "amount", e.target.value)
              }
            />
          </Cell>
          <Cell>
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
              // displayEmpty
              // renderValue={(selectedValue) => (
              //   <div style={{ overflow: "hidden", fontSize: "14px" }}>
              //     {selectedValue ? (
              //       selectedValue
              //     ) : (
              //       <p style={{ color: "var(--clr-gray-400)" }}>currency</p>
              //     )}
              //   </div>
              // )}
              sx={CategoryDropdownStyle}
            >
              {assetsList?.map(
                (item, i) =>
                  !item.hidden && (
                    <MenuItem
                      key={i}
                      value={item.tokenInfo.address}
                      sx={{
                        paddingInline: "5px",
                        fontSize: "14px",
                        marginInline: "10px",
                        borderRadius: "6px",
                        margin: "5px 8px",
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
          </Cell>
        </TableRow>
        {/* ))} */}
      </TableBody>
    </Table>
    // </TableContainer>
  );
};

export default PaymentDetailsForm;
