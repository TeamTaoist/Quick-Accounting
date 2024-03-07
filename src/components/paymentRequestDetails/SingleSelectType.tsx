import { TableCell, TableRow } from "@mui/material";
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import ReactSelect from "../ReactSelect";
import selectIcon from "../../assets/workspace/select.svg";
import { ReactSelectOption } from "../../pages/workspace/paymentRequest/PaymentRequestDetails";
import { CategoryProperties } from "../../store/useCategoryProperty";

interface SingleSelectTypeProps {
  property: any;
  handleUpdateCategory: () => void;
  status: number;
  selectSingleValue: ReactSelectOption | undefined;
  handleSelectSingleChange: (
    selectedOption: ReactSelectOption,
    name: string,
    type: string
  ) => void;
  parseCategoryProperties: any;
  defaultPropertyValue: CategoryProperties;
}

const SingleSelectType = ({
  property,
  handleUpdateCategory,
  status,
  selectSingleValue,
  handleSelectSingleChange,
  parseCategoryProperties,
  defaultPropertyValue,
}: SingleSelectTypeProps) => {
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
            <Image src={selectIcon} alt="" /> {property.name}
          </NoteInfo>
        </TableCell>
        <TableCell onBlur={handleUpdateCategory}>
          <ReactSelect
            isMulti={false}
            isDisabled={status === 2}
            value={selectSingleValue}
            onChange={(selectedOption: ReactSelectOption) =>
              handleSelectSingleChange(
                selectedOption,
                property.name,
                property.type
              )
            }
            options={property.values.split(";").map((v: string) => ({
              value: v,
              label: v,
            }))}
            defaultValues={parseCategoryProperties
              ?.filter(
                (p: any) =>
                  p.type === "single-select" && p.name === property.name
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

export default SingleSelectType;
