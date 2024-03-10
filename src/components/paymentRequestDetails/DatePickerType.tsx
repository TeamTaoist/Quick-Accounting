import { TableCell, TableRow, TextField } from "@mui/material";
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
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
            <Image src={multiSelect} alt="" /> {property.name}
          </NoteInfo>
        </TableCell>

        <TableCell onBlur={handleUpdateCategory}>
          <TextField
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
          />
        </TableCell>
      </TableRow>
    );
  }
  return null;
};

export default DatePickerType;
