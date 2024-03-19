import { TableCell, TableRow, TextField } from "@mui/material";
import {
  NoteInfo,
  PaymentRequestDateInput,
} from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import multiSelect from "../../assets/workspace/multi-select.svg";
import { CategoryProperties } from "../../store/useCategoryProperty";
import { useRef } from "react";

interface TextTypeProps {
  property: any;
  handleUpdateCategory: () => void;
  datePicker: {
    [name: string]: any;
  };
  handleDatePickerProperty: (e: any, name: string, type: string) => void;
  status: number;
  defaultPropertyValue: CategoryProperties;
}

const DatePickerType = ({
  property,
  handleUpdateCategory,
  datePicker,
  handleDatePickerProperty,
  status,
  defaultPropertyValue,
}: TextTypeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputClick = () => {
    inputRef.current?.showPicker();
  };

  if (!!defaultPropertyValue || !property.archived) {
    return (
      <TableRow
        sx={{
          td: {
            padding: 0,
            paddingInline: 2,
            fontFamily: "Inter",
            height: "56px",
          },
        }}
      >
        <TableCell
          sx={{
            height: 1,
            width: 200,
            fontSize: "16px",
            fontWeight: "500",
            borderBottom: "none",
            borderTop: "1px solid var(--clr-gray-200)",
          }}
        >
          <NoteInfo>
            <Image src={multiSelect} alt="" /> {property.name}
          </NoteInfo>
        </TableCell>

        <TableCell
          onBlur={handleUpdateCategory}
          sx={{
            borderBottom: "none",
            borderTop: "1px solid var(--clr-gray-200)",
          }}
        >
          {/* <TextField
            inputRef={inputRef}
            disabled={status === 2}
            sx={{
              "& fieldset": { border: "none" },
              "& input::-webkit-calendar-picker-indicator": {
                // display: "none",
              },
              "& input": {
                paddingInline: "10px",
              },
            }}
            size="small"
            fullWidth
            type="date"
            value={datePicker[property.name]?.values || ""}
            onChange={(e) =>
              handleDatePickerProperty(e, property.name, property.type)
            }
            onClick={handleInputClick}
            InputProps={{
              style: {
                paddingInline: 0,
                color: datePicker[property.name]?.values ? "black" : "gray",
              },
            }}
          /> */}
          <PaymentRequestDateInput
            inputRef={inputRef}
            disabled={status === 2}
            type="date"
            value={datePicker[property.name]?.values || ""}
            onChange={(e: any) =>
              handleDatePickerProperty(e, property.name, property.type)
            }
            onClick={handleInputClick}
          />
        </TableCell>
      </TableRow>
    );
  }
  return null;
};

export default DatePickerType;
