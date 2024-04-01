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

const PaymentDetailsForm = ({
  handleFormChange,
  value,
  index,
  isEditable,
  sharePaymentRequestForm,
}: PaymentDetailsFormProps) => {
  const { assetsList } = useWorkspace();
  return (
    // <TableContainer
    //   sx={{
    //     boxShadow: "none",
    //     borderLeft: "1px solid var(--clr-gray-200)",
    //     borderRight: "1px solid var(--clr-gray-200)",
    //     // borderTopRightRadius: "6px",
    //     // borderTopLeftRadius: "6px",
    //   }}
    // >
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <HeaderCell width="260px">Recipient</HeaderCell>
          <HeaderCell width="230px">Amount</HeaderCell>
          <HeaderCell width="230px">Currency</HeaderCell>
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
          </Cell>
        </TableRow>
        {/* ))} */}
      </TableBody>
    </Table>
    // </TableContainer>
  );
};

export default PaymentDetailsForm;
