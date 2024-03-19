import { TableCell, TableRow, TextField } from "@mui/material";
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import multiSelect from "../../assets/workspace/multi-select.svg";
import { paymentRequestBody } from "../workspace/paymentRequest/PaymentRequestGroupDetails";
import ReactSelect from "../ReactSelect";
import { ReactSelectOption } from "../../pages/workspace/bookkeeping/BookkeepingTransferDetails";

interface GroupMultiSelectTypeProps {
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
  selectedValues: any[];
}

const GroupMultiSelectType = ({
  properties,
  handleUpdatePaymentRequest,
  payment,
  sharePaymentRequestForm,
  index,
  handleFormChange,
  defaultPropertyValue,
  selectedValues,
}: GroupMultiSelectTypeProps) => {
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
            <Image src={multiSelect} alt="" /> {properties.name}
          </NoteInfo>
        </TableCell>
        <TableCell
          sx={{
            borderBottom: "none",
            borderTop: "1px solid var(--clr-gray-200)",
          }}
          onBlur={() => handleUpdatePaymentRequest(payment.id)}
        >
          <ReactSelect
            value={selectedValues}
            // isDisabled={isEditable}
            // onChange={handleSelectChange}
            onChange={(selectedOption: ReactSelectOption) =>
              handleFormChange(
                index,
                "categoryProperties",
                selectedOption,
                properties.name,
                properties.type
              )
            }
            options={properties.values.split(";").map((v: any) => ({
              value: v,
              label: v,
            }))}
            defaultValues={sharePaymentRequestForm[index].category_properties
              .filter(
                (p: any) =>
                  p.type === "multi-select" && p.name === properties.name
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
  }
  return null;
};

export default GroupMultiSelectType;
