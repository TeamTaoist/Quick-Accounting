import { TableCell, TableRow, TextField } from "@mui/material";
import {
  NoteInfo,
  PaymentRequestInput,
} from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import optionsIcon from "../../assets/workspace/option.svg";
import { CategoryProperties } from "../../store/useCategoryProperty";
import { Cell } from "../table";

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
      <TableRow>
        <Cell width="220">
          <NoteInfo>
            <Image src={optionsIcon} alt="" /> {property.name}
          </NoteInfo>
        </Cell>

        <Cell width="500" onBlur={handleUpdateCategory}>
          <PaymentRequestInput
            disabled={status === 2}
            value={proPertyTextValue[property.name]?.values || ""}
            placeholder="Enter content"
            onChange={(e: any) =>
              handlePropertyText(e, property.name, property.type)
            }
          />
        </Cell>
      </TableRow>
    );
  }
  return null;
};

export default TextType;
