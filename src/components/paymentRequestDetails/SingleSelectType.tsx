import React from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import ReactSelect from "../ReactSelect";
import usePaymentsStore from "../../store/usePayments";
import selectIcon from "../../assets/workspace/select.svg";
import multiSelect from "../../assets/workspace/multi-select.svg";
import optionsIcon from "../../assets/workspace/option.svg";
import { ReactSelectOption } from "../../pages/workspace/paymentRequest/PaymentRequestDetailsReadOnly";

interface SingleSelectTypeProps {
  property: any;
  handleUpdateCategory: () => void;
  status: number;
  selectSingleValue: ReactSelectOption | undefined;
  handleSelectSingleChange: (
    selectedOption: ReactSelectOption,
    name: string,
    type: string
  ) => void;
  parseCategoryProperties: any;
}

const SingleSelectType = ({
  property,
  handleUpdateCategory,
  status,
  selectSingleValue,
  handleSelectSingleChange,
  parseCategoryProperties,
}: SingleSelectTypeProps) => {
  return (
    <TableRow
      sx={{
        td: {
          border: "1px solid var(--border-table)",
          padding: 1,
          paddingInline: 1,
        },
      }}
    >
      <TableCell sx={{ height: 1, width: 200 }}>
        <NoteInfo>
          <Image src={selectIcon} alt="" /> {property.name}
        </NoteInfo>
      </TableCell>
      <TableCell onBlur={handleUpdateCategory}>
        <ReactSelect
          isMulti={false}
          isDisabled={status === 2}
          value={selectSingleValue}
          onChange={(selectedOption: ReactSelectOption) =>
            handleSelectSingleChange(
              selectedOption,
              property.name,
              property.type
            )
          }
          options={property.values.split(";").map((v: string) => ({
            value: v,
            label: v,
          }))}
          defaultValues={parseCategoryProperties
            .filter(
              (p: any) => p.type === "single-select" && p.name === property.name
            )
            .map((p: any) =>
              p.values.split(";").map((v: string) => ({
                value: v,
                label: v,
              }))
            )
            .flat()}
        />
      </TableCell>
    </TableRow>
  );
};

export default SingleSelectType;
