import { TableCell, TableRow, TextField } from "@mui/material";
import {
  NoteInfo,
  PaymentRequestInput,
} from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
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
            <Image src={optionsIcon} alt="" /> {property.name}
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
            onChange={(e) =>
              handlePropertyText(e, property.name, property.type)
            }
            InputProps={{
              style: { padding: 0 },
            }}
          /> */}
          <PaymentRequestInput
            disabled={status === 2}
            value={proPertyTextValue[property.name]?.values || ""}
            placeholder="Enter content"
            onChange={(e: any) =>
              handlePropertyText(e, property.name, property.type)
            }
          />
        </TableCell>
      </TableRow>
    );
  }
  return null;
};

export default TextType;
