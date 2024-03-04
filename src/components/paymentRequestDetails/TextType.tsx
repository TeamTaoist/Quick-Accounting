import { TableCell, TableRow, TextField } from "@mui/material";
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import optionsIcon from "../../assets/workspace/option.svg";
import { CategoryProperties } from "../../store/useCategoryProperty";

interface TextTypeProps {
  property: any;
  handleUpdateCategory: () => void;
  proPertyTextValue: {
    [name: string]: any;
  };
  handlePropertyText: (e: any, name: string, type: string) => void;
  status: number;
  defaultPropertyValue: CategoryProperties;
}

const TextType = ({
  property,
  handleUpdateCategory,
  proPertyTextValue,
  handlePropertyText,
  status,
  defaultPropertyValue,
}: TextTypeProps) => {
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
            <Image src={optionsIcon} alt="" /> {property.name}
          </NoteInfo>
        </TableCell>

        <TableCell onBlur={handleUpdateCategory}>
          <TextField
            disabled={status === 2}
            sx={{
              "& fieldset": { border: "none" },
            }}
            size="small"
            fullWidth
            // value={propertyContent}
            value={proPertyTextValue[property.name]?.values || ""}
            // id="fullWidth"
            placeholder="Enter content"
            type={property.type === "date-picker" ? "date" : "text"}
            // type="date"
            onChange={(e) =>
              handlePropertyText(e, property.name, property.type)
            }
            InputProps={{
              style: { padding: 0 },
            }}
          />
        </TableCell>
      </TableRow>
    );
  }
  return null;
};

export default TextType;
