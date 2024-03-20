import React from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useSharePaymentRequest } from "../../store/useSharePaymentRequest";
import {
  NoteInfo,
  PaymentRequestDateInput,
  PaymentRequestInput,
} from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import { Image } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import categoryIcon from "../../assets/workspace/category-icon.svg";
import arrowBottom from "../../assets/workspace/arrow-bottom.svg";
import selectIcon from "../../assets/workspace/select.svg";
import ReactSelect from "../ReactSelect";
import { ReactSelectOption } from "../../pages/workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import multiSelect from "../../assets/workspace/multi-select.svg";
import optionsIcon from "../../assets/workspace/option.svg";

interface GroupPaymentCategoryPropertiesProps {
  sharePaymentRequestForm: SharePaymentRequestBody[];
  index: number;
  isEditable: boolean;
  handleCategoryDropdown: (
    categoryId: number,
    categoryName: string,
    index: number
  ) => void;
  selectedCategories: any[];
  selectedValues: any[];
  handleFormChange: (
    index: number,
    field: string,
    value: any,
    propertyName?: string,
    propertyType?: string,
    categoryId?: number
  ) => void;
}

const GroupPaymentCategoryProperties = ({
  sharePaymentRequestForm,
  index,
  isEditable,
  handleCategoryDropdown,
  selectedCategories,
  selectedValues,
  handleFormChange,
}: GroupPaymentCategoryPropertiesProps) => {
  const { shareData } = useSharePaymentRequest();
  return (
    <TableContainer>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableBody
          sx={{ boxShadow: "none", border: "1px solid var(--clr-gray-200)" }}
        >
          <TableRow
            sx={{
              td: {
                padding: 1,
                paddingInline: "16px",
                borderBottom: "none",
                borderTop: "1px solid var(--clr-gray-200)",
              },
            }}
          >
            <TableCell
              sx={{
                height: 1,
                width: "33.5%",
                fontSize: "16px",
                fontWeight: "500",
                borderBottom: "none",
                borderTop: "1px solid var(--clr-gray-200)",
              }}
            >
              <NoteInfo>
                <Image src={categoryIcon} alt="" /> Category
              </NoteInfo>
            </TableCell>
            <TableCell>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sharePaymentRequestForm[index].category_name}
                  label={sharePaymentRequestForm[index].category_name}
                  size="small"
                  // onChange={handleCategoryChange}
                  IconComponent={() => (
                    <InputAdornment position="start">
                      <img
                        src={arrowBottom}
                        alt="Custom Arrow Icon"
                        style={{ marginRight: "20px" }}
                      />
                    </InputAdornment>
                  )}
                  sx={{
                    minWidth: "100%",
                    height: "40px",
                    "& .MuiSelect-select": {
                      display: "block",
                    },
                    "&.MuiOutlinedInput-root": {
                      border: "1px solid var(--clr-gray-200)",
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                    // "& fieldset": { border: "none" },
                    "& .MuiInputLabel-root": { display: "none" },
                  }}
                  inputProps={{
                    readOnly: isEditable,
                  }}
                >
                  <MenuItem disabled value="">
                    {sharePaymentRequestForm[index].category_name}
                  </MenuItem>
                  {shareData?.category_and_properties?.map((category) => (
                    <MenuItem
                      key={category.ID}
                      value={category.name}
                      onClick={() => {
                        handleCategoryDropdown(
                          category.ID,
                          category.name,
                          index
                        );
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor: "var(--clr-gray-100)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "var(--clr-gray-200)",
                        },
                      }}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
          {/* category property */}
          <>
            {selectedCategories[index]?.properties?.map(
              (property: ICategoryProperties, i: number) => (
                <React.Fragment key={i}>
                  {property.type === "single-select" && (
                    <TableRow
                      sx={{
                        td: {
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          height: 1,
                          width: 252,
                          fontSize: "16px",
                          fontWeight: "500",
                          borderBottom: "none",
                          borderTop: "1px solid var(--clr-gray-200)",
                        }}
                      >
                        <NoteInfo>
                          <Image src={selectIcon} alt="" /> {property.name}
                        </NoteInfo>
                      </TableCell>
                      {/* add multi select first */}
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          borderTop: "1px solid var(--clr-gray-200)",
                        }}
                      >
                        <ReactSelect
                          value={selectedValues}
                          isMulti={false}
                          isDisabled={isEditable}
                          onChange={(selectedOption: ReactSelectOption) =>
                            handleFormChange(
                              index,
                              "categoryProperties",
                              selectedOption,
                              property.name,
                              property.type
                            )
                          }
                          options={property.values
                            .split(";")
                            .map((v: string) => ({
                              value: v,
                              label: v,
                            }))}
                          defaultValues={sharePaymentRequestForm[
                            index
                          ].category_properties
                            .filter(
                              (p: any) =>
                                p.type === "single-select" &&
                                p.name === property.name
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
                  )}
                  {property.type === "multi-select" && (
                    <TableRow
                      sx={{
                        td: {
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          height: 1,
                          width: 252,
                          fontSize: "16px",
                          fontWeight: "500",
                          borderBottom: "none",
                          borderTop: "1px solid var(--clr-gray-200)",
                        }}
                      >
                        <NoteInfo>
                          <Image src={multiSelect} alt="" /> {property.name}
                        </NoteInfo>
                      </TableCell>
                      {/* add multi select */}
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          borderTop: "1px solid var(--clr-gray-200)",
                        }}
                      >
                        <ReactSelect
                          value={selectedValues}
                          isDisabled={isEditable}
                          // onChange={handleSelectChange}
                          onChange={(selectedOption: ReactSelectOption) =>
                            handleFormChange(
                              index,
                              "categoryProperties",
                              selectedOption,
                              property.name,
                              property.type
                            )
                          }
                          options={property.values.split(";").map((v: any) => ({
                            value: v,
                            label: v,
                          }))}
                          defaultValues={sharePaymentRequestForm[
                            index
                          ].category_properties
                            .filter(
                              (p: any) =>
                                p.type === "multi-select" &&
                                p.name === property.name
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
                  )}
                  {property.type === "Text" && (
                    <TableRow
                      sx={{
                        td: {
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          height: 1,
                          width: 252,
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
                      {/* add multi select */}
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          borderTop: "1px solid var(--clr-gray-200)",
                        }}
                      >
                        {/* <TextField
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                          size="small"
                          autoComplete="off"
                          fullWidth
                          value={
                            sharePaymentRequestForm[
                              index
                            ].category_properties.find(
                              (p) =>
                                p.name === property.name && p.type === "Text"
                            )?.values || ""
                          }
                          placeholder="Enter content"
                          onChange={(e) =>
                            handleFormChange(
                              index,
                              "categoryProperties",
                              e.target.value,
                              property.name,
                              property.type
                            )
                          }
                          InputProps={{
                            style: { padding: 0 },
                            readOnly: isEditable,
                          }}
                        /> */}
                        <PaymentRequestInput
                          value={
                            sharePaymentRequestForm[
                              index
                            ].category_properties.find(
                              (p) =>
                                p.name === property.name && p.type === "Text"
                            )?.values || ""
                          }
                          placeholder="Enter content"
                          onChange={(e: any) =>
                            handleFormChange(
                              index,
                              "categoryProperties",
                              e.target.value,
                              property.name,
                              property.type
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  {property.type === "date-picker" && (
                    <TableRow
                      sx={{
                        td: {
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          height: 1,
                          width: 252,
                          fontSize: "16px",
                          fontWeight: "500",
                          borderBottom: "none",
                          borderTop: "1px solid var(--clr-gray-200)",
                        }}
                      >
                        <NoteInfo>
                          <Image src={multiSelect} alt="" /> {property.name}
                        </NoteInfo>
                      </TableCell>
                      {/* add multi select */}
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          borderTop: "1px solid var(--clr-gray-200)",
                        }}
                      >
                        {/* <TextField
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                          size="small"
                          autoComplete="off"
                          fullWidth
                          type="date"
                          value={
                            sharePaymentRequestForm[
                              index
                            ].category_properties.find(
                              (p) =>
                                p.name === property.name &&
                                p.type === "date-picker"
                            )?.values || ""
                          }
                          placeholder="Enter content"
                          onChange={(e) =>
                            handleFormChange(
                              index,
                              "categoryProperties",
                              e.target.value,
                              property.name,
                              property.type
                            )
                          }
                          InputProps={{
                            style: { padding: 0 },
                            readOnly: isEditable,
                          }}
                        /> */}
                        <PaymentRequestDateInput
                          type="date"
                          value={
                            sharePaymentRequestForm[
                              index
                            ].category_properties.find(
                              (p) =>
                                p.name === property.name &&
                                p.type === "date-picker"
                            )?.values || ""
                          }
                          placeholder="Enter content"
                          isDatePicker={sharePaymentRequestForm[
                            index
                          ].category_properties.find(
                            (p) =>
                              p.name === property.name &&
                              p.type === "date-picker"
                          )}
                          onChange={(e: any) =>
                            handleFormChange(
                              index,
                              "categoryProperties",
                              e.target.value,
                              property.name,
                              property.type
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            )}
          </>
          {/* )} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GroupPaymentCategoryProperties;
