import { TableCell, TableRow, TextField } from "@mui/material";
import {
  NoteInfo,
  PaymentRequestDateInput,
} from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import multiSelect from "../../assets/workspace/multi-select.svg";
import { CategoryProperties } from "../../store/useCategoryProperty";
import { useRef } from "react";
import { Cell } from "../table";

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
    // inputRef.current?.showPicker();
    if (inputRef.current && inputRef.current.showPicker) {
      inputRef.current.showPicker();
    }
  };

  if (!!defaultPropertyValue || !property.archived) {
    return (
      <TableRow>
        <Cell width="220">
          <NoteInfo>
            <Image src={multiSelect} alt="" /> {property.name}
          </NoteInfo>
        </Cell>

        <Cell width="500" onBlur={handleUpdateCategory}>
          {/* <TextField
            inputRef={inputRef}
            disabled={status === 2}
            sx={{
              "& fieldset": {
                border: "1px solid var(--clr-gray-200)",
                borderRadius: "6px",
                fontSize: "14px",
              },
              "& input::-webkit-calendar-picker-indicator": {
                // display: "none",
              },
              "& input": {
                paddingInline: "10px",
                fontSize: "14px",
                height: "23px",
                "&:focus": {
                  outline: "none",
                },
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
            isActive={datePicker[property.name]?.values}
            type="date"
            value={datePicker[property.name]?.values || ""}
            onChange={(e: any) =>
              handleDatePickerProperty(e, property.name, property.type)
            }
            onClick={handleInputClick}
          />
        </Cell>
      </TableRow>
    );
  }
  return null;
};

export default DatePickerType;
