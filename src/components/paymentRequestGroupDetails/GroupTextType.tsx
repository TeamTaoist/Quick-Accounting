import { TableCell, TableRow, TextField } from "@mui/material";
import {
  NoteInfo,
  PaymentRequestInput,
} from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import optionsIcon from "../../assets/workspace/option.svg";
import { paymentRequestBody } from "../workspace/paymentRequest/PaymentRequestGroupDetails";

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
      <TableRow
        sx={{
          td: {
            // padding: 1,
            // paddingInline: 1,
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
            <Image src={optionsIcon} alt="" /> {properties.name}
          </NoteInfo>
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "none",
            borderTop: "1px solid var(--clr-gray-200)",
          }}
          onBlur={() => handleUpdatePaymentRequest(payment.id)}
        >
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
        </TableCell>
      </TableRow>
    );
  }
  return null;
};

export default GroupTextType;
