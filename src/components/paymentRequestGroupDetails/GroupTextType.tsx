import { TableCell, TableRow, TextField } from "@mui/material";
import {
  NoteInfo,
  PaymentRequestInput,
} from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import optionsIcon from "../../assets/workspace/option.svg";
import { paymentRequestBody } from "../workspace/paymentRequest/PaymentRequestGroupDetails";
import { Cell } from "../table";

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

const GroupTextType = ({
  properties,
  handleUpdatePaymentRequest,
  payment,
  sharePaymentRequestForm,
  index,
  handleFormChange,
  defaultPropertyValue,
}: GroupTextTypeProps) => {
  if (!!defaultPropertyValue || !properties.archived) {
    return (
      <TableRow>
        <Cell>
          <NoteInfo>
            <Image src={optionsIcon} alt="" /> {properties.name}
          </NoteInfo>
        </Cell>
        <Cell onBlur={() => handleUpdatePaymentRequest(payment.id)}>
          {/* <TextField
            sx={{
              "& fieldset": { border: "none" },
            }}
            size="small"
            fullWidth
            value={
              sharePaymentRequestForm[index].category_properties.find(
                (p: any) => p.type === "Text" && p.name === properties.name
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
            InputProps={{
              style: { padding: 0 },
              // readOnly: isEditable,
            }}
          /> */}
          <PaymentRequestInput
            value={
              sharePaymentRequestForm[index].category_properties.find(
                (p: any) => p.type === "Text" && p.name === properties.name
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
          />
        </Cell>
      </TableRow>
    );
  }
  return null;
};

export default GroupTextType;
