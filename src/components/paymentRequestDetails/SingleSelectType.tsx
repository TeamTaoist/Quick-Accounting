import { TableCell, TableRow } from "@mui/material";
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import ReactSelect from "../ReactSelect";
import selectIcon from "../../assets/workspace/select.svg";
import { ReactSelectOption } from "../../pages/workspace/paymentRequest/PaymentRequestDetails";
import { CategoryProperties } from "../../store/useCategoryProperty";
import { Cell } from "../table";

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
      <TableRow>
        <Cell width="220">
          <NoteInfo>
            <Image src={selectIcon} alt="" /> {property.name}
            {/* <Image src={selectIcon} alt="" />{" "}
            <input type="text" value={property.name} /> */}
          </NoteInfo>
        </Cell>
        <Cell width="500" onBlur={handleUpdateCategory}>
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
        </Cell>
      </TableRow>
    );
  }
  return null;
};

export default SingleSelectType;
