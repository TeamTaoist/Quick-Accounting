import { TableCell, TableRow, TextField } from "@mui/material";
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import multiSelect from "../../assets/workspace/multi-select.svg";
import { paymentRequestBody } from "../workspace/paymentRequest/PaymentRequestGroupDetails";
import { useRef } from "react";

interface GroupTextTypeProps {
  properties: any;
  handleUpdatePaymentRequest: (paymentId: number) => void;
  sharePaymentRequestForm: paymentRequestBody[];
  payment: any;
  index: number;
  handleFormChange: (
    index: number,
    field: string,
    value: any,
    propertyName?: string,
    propertyType?: string,
    categoryId?: number
  ) => void;
  defaultPropertyValue: any;
}

const GroupDatePickerType = ({
  properties,
  handleUpdatePaymentRequest,
  payment,
  sharePaymentRequestForm,
  index,
  handleFormChange,
  defaultPropertyValue,
}: GroupTextTypeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputClick = () => {
    inputRef.current?.showPicker();
  };

  if (!!defaultPropertyValue || !properties.archived) {
    return (
      <TableRow
        sx={{
          td: {
            padding: 1,
            paddingInline: 1,
          },
        }}
      >
        <TableCell
          sx={{
            height: 1,
            width: 200,
            borderRight: "1px solid var(--border-table)",
          }}
        >
          <NoteInfo>
            <Image src={multiSelect} alt="" /> {properties.name}
          </NoteInfo>
        </TableCell>
        <TableCell onBlur={() => handleUpdatePaymentRequest(payment.id)}>
          <TextField
            inputRef={inputRef}
            sx={{
              "& fieldset": { border: "none" },
              "& input": {
                paddingInline: "10px",
              },
            }}
            size="small"
            fullWidth
            type="date"
            value={
              sharePaymentRequestForm[index].category_properties.find(
                (p: any) =>
                  p.type === "date-picker" && p.name === properties.name
              )?.values || ""
            }
            // id="fullWidth"
            placeholder="Enter content"
            onChange={(e) =>
              handleFormChange(
                index,
                "categoryProperties",
                e.target.value,
                properties.name,
                properties.type
              )
            }
            onClick={handleInputClick}
            InputProps={{
              style: {
                padding: 0,
                color: sharePaymentRequestForm[index].category_properties.find(
                  (p: any) =>
                    p.type === "date-picker" && p.name === properties.name
                )?.values
                  ? "black"
                  : "gray",
              },
            }}
          />
        </TableCell>
      </TableRow>
    );
  }
  return null;
};

export default GroupDatePickerType;
