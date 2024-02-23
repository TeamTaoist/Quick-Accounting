import React from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import ReactSelect from "../ReactSelect";
import usePaymentsStore from "../../store/usePayments";
import selectIcon from "../../assets/workspace/select.svg";
import multiSelect from "../../assets/workspace/multi-select.svg";
import optionsIcon from "../../assets/workspace/option.svg";
import { ReactSelectOption } from "../../pages/workspace/paymentRequest/PaymentRequestDetailsReadOnly";
import SingleSelectType from "./SingleSelectType";
import MultiSelectType from "./MultiSelectType";

interface PaymentRequestCategoryPropertiesProps {
  selectedCategory: any;
  handleUpdateCategory: () => void;
  selectSingleValue: ReactSelectOption | undefined;
  handleSelectSingleChange: (
    selectedOption: ReactSelectOption,
    name: string,
    type: string
  ) => void;
  parseCategoryProperties: any;
  selectedValues: ReactSelectOption[];
  handleSelectChange: (
    selectedOptions: ReactSelectOption[],
    name: string,
    type: string
  ) => void;
  proPertyTextValue: {
    [name: string]: any;
  };
  handlePropertyText: (e: any, name: string, type: string) => void;
  status: number;
}

const PaymentRequestCategoryProperties = ({
  selectedCategory,
  handleUpdateCategory,
  selectSingleValue,
  handleSelectSingleChange,
  parseCategoryProperties,
  selectedValues,
  handleSelectChange,
  proPertyTextValue,
  handlePropertyText,
  status,
}: PaymentRequestCategoryPropertiesProps) => {
  console.log(parseCategoryProperties);
  // const hasEmptyValue = parseCategoryProperties.some((p: any) => p[property.name] === "");
  return (
    <>
      {selectedCategory?.properties?.map((property: any) => (
        <React.Fragment key={property.ID}>
          {/* {property.type === "single-select" && !property.archived && (
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
                    .filter(
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
          )} */}
          {property.type === "single-select" &&
            (parseCategoryProperties.length > 0 ? (
              <SingleSelectType
                property={property}
                handleUpdateCategory={handleUpdateCategory}
                status={status}
                selectSingleValue={selectSingleValue}
                handleSelectSingleChange={handleSelectSingleChange}
                parseCategoryProperties={parseCategoryProperties}
              />
            ) : (
              !property.archived && (
                <SingleSelectType
                  property={property}
                  handleUpdateCategory={handleUpdateCategory}
                  status={status}
                  selectSingleValue={selectSingleValue}
                  handleSelectSingleChange={handleSelectSingleChange}
                  parseCategoryProperties={parseCategoryProperties}
                />
              )
            ))}
        </React.Fragment>
      ))}
      {selectedCategory?.properties?.map((property: any, index: number) => (
        <>
          {property.type === "multi-select" &&
            (parseCategoryProperties.length > 0 ? (
              <MultiSelectType
                property={property}
                handleUpdateCategory={handleUpdateCategory}
                status={status}
                selectedValues={selectedValues}
                handleSelectChange={handleSelectChange}
                parseCategoryProperties={parseCategoryProperties}
              />
            ) : (
              !property.archived && (
                <MultiSelectType
                  property={property}
                  handleUpdateCategory={handleUpdateCategory}
                  status={status}
                  selectedValues={selectedValues}
                  handleSelectChange={handleSelectChange}
                  parseCategoryProperties={parseCategoryProperties}
                />
              )
            ))}
        </>
      ))}
      {selectedCategory.properties?.map((property: any) => (
        <>
          {property.type === "Text" &&
            (parseCategoryProperties.length > 0 ? (
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
                    onChange={(e) =>
                      handlePropertyText(e, property.name, property.type)
                    }
                    InputProps={{
                      style: { padding: 0 },
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              !property.archived && (
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
                      onChange={(e) =>
                        handlePropertyText(e, property.name, property.type)
                      }
                      InputProps={{
                        style: { padding: 0 },
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            ))}
        </>
      ))}
    </>
  );
};

export default PaymentRequestCategoryProperties;
