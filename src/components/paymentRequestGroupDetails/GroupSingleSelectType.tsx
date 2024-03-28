import { TableCell, TableRow, TextField } from "@mui/material";
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import selectIcon from "../../assets/workspace/select.svg";
import { paymentRequestBody } from "../workspace/paymentRequest/PaymentRequestGroupDetails";
import ReactSelect from "../ReactSelect";
import { ReactSelectOption } from "../../pages/workspace/bookkeeping/BookkeepingTransferDetails";
import { Cell } from "../table";

interface GroupSingleSelectTypeProps {
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
const GroupSingleSelectType = ({
  properties,
  handleUpdatePaymentRequest,
  payment,
  sharePaymentRequestForm,
  index,
  handleFormChange,
  defaultPropertyValue,
  selectedValues,
}: GroupSingleSelectTypeProps) => {
  if (!!defaultPropertyValue || !properties.archived) {
    return (
      <TableRow>
        <Cell>
          <NoteInfo>
            <Image src={selectIcon} alt="" /> {properties.name}
          </NoteInfo>
        </Cell>
        <Cell
          sx={{
            borderBottom: "none",
            borderTop: "1px solid var(--clr-gray-200)",
          }}
          onBlur={() => handleUpdatePaymentRequest(payment.id)}
        >
          <ReactSelect
            value={selectedValues}
            isMulti={false}
            // isDisabled={isEditable}
            onChange={(selectedOption: ReactSelectOption) =>
              handleFormChange(
                index,
                "categoryProperties",
                selectedOption,
                properties.name,
                properties.type
              )
            }
            options={properties.values.split(";").map((v: string) => ({
              value: v,
              label: v,
            }))}
            defaultValues={sharePaymentRequestForm[index].category_properties
              .filter(
                (p: any) =>
                  p.type === "single-select" && p.name === properties.name
              )
              .map((p: any) =>
                p.values.split(";").map((v: string) => ({
                  value: v,
                  label: v,
                }))
              )
              .flat()}
          />
        </Cell>
      </TableRow>
    );
  }
  return null;
};

export default GroupSingleSelectType;
