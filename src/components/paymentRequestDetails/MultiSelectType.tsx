import { TableCell, TableRow } from "@mui/material";
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import ReactSelect from "../ReactSelect";
import multiSelect from "../../assets/workspace/multi-select.svg";
import { ReactSelectOption } from "../../pages/workspace/paymentRequest/PaymentRequestDetails";
import { CategoryProperties } from "../../store/useCategoryProperty";

interface MultiSelectTypeProps {
  property: any;
  handleUpdateCategory: () => void;
  status: number;
  selectedValues: ReactSelectOption[];
  handleSelectChange: (
    selectedOptions: ReactSelectOption[],
    name: string,
    type: string
  ) => void;
  parseCategoryProperties: any;
  defaultPropertyValue: CategoryProperties;
}

const MultiSelectType = ({
  property,
  handleUpdateCategory,
  status,
  selectedValues,
  handleSelectChange,
  parseCategoryProperties,
  defaultPropertyValue,
}: MultiSelectTypeProps) => {
  if (!!defaultPropertyValue || !property.archived) {
    return (
      <TableRow
        sx={{
          td: {
            border: "1px solid var(--border-table)",
            padding: 1,
            paddingInline: 1,
          },
        }}
      >
        <TableCell sx={{ height: 1, width: 200 }}>
          <NoteInfo>
            <Image src={multiSelect} alt="" /> {property.name}
          </NoteInfo>
        </TableCell>

        <TableCell onBlur={handleUpdateCategory}>
          <ReactSelect
            isDisabled={status === 2}
            value={selectedValues}
            onChange={(selectedOptions: ReactSelectOption[]) =>
              handleSelectChange(selectedOptions, property.name, property.type)
            }
            options={property.values.split(";").map((v: string) => ({
              value: v,
              label: v,
            }))}
            defaultValues={parseCategoryProperties
              .filter(
                (p: any) =>
                  p.type === "multi-select" && p.name === property.name
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
};

export default MultiSelectType;
