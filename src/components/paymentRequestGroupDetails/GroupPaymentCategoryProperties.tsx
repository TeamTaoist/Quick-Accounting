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
import { Cell } from "../table";
import { Item } from "../categoryDropdown";
import CheckIcon from "@mui/icons-material/Check";

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
          sx={
            {
              // boxShadow: "none",
              // borderLeft: "1px solid var(--clr-gray-200)",
              // borderRight: "1px solid var(--clr-gray-200)",
              // overflow: "hidden",
            }
          }
        >
          <TableRow>
            <Cell width="220px">
              <NoteInfo>
                <Image src={categoryIcon} alt="" /> Category
              </NoteInfo>
            </Cell>
            <Cell width="490px">
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
                  renderValue={(selectedValue) => (
                    <div
                      style={{
                        overflow: "hidden",
                        fontSize: "14px",
                      }}
                    >
                      {selectedValue}
                    </div>
                  )}
                  MenuProps={{
                    sx: {
                      "& .MuiMenuItem-root": {
                        marginInline: "10px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "500",
                        margin: "5px 8px",
                        "&:hover": {
                          bgcolor: "var(--clr-gray-100)",
                        },
                        "&.Mui-selected": {
                          bgcolor: "var(--clr-gray-100)",
                        },
                      },
                    },
                  }}
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
                        fontSize: "14px",
                        "&:hover": {
                          backgroundColor: "var(--clr-gray-100)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "var(--clr-gray-200)",
                        },
                      }}
                    >
                      {/* {category.name} */}
                      <Item>
                        <div
                          style={{
                            width: "14px",
                            marginRight: "10px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {sharePaymentRequestForm[index].category_id ===
                            category.ID && (
                            <CheckIcon
                              style={{
                                color: "#334155",
                                width: "16px",
                              }}
                            />
                          )}
                        </div>

                        {category.name}
                      </Item>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Cell>
          </TableRow>
          {/* category property */}
          <>
            {selectedCategories[index]?.properties?.map(
              (property: ICategoryProperties, i: number) => (
                <React.Fragment key={i}>
                  {property.type === "single-select" && (
                    <TableRow>
                      <Cell>
                        <NoteInfo>
                          <Image src={selectIcon} alt="" /> {property.name}
                        </NoteInfo>
                      </Cell>
                      {/* add multi select first */}
                      <Cell>
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
                      </Cell>
                    </TableRow>
                  )}
                  {property.type === "multi-select" && (
                    <TableRow>
                      <Cell>
                        <NoteInfo>
                          <Image src={multiSelect} alt="" /> {property.name}
                        </NoteInfo>
                      </Cell>
                      {/* add multi select */}
                      <Cell>
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
                      </Cell>
                    </TableRow>
                  )}
                  {property.type === "Text" && (
                    <TableRow>
                      <Cell>
                        <NoteInfo>
                          <Image src={optionsIcon} alt="" /> {property.name}
                        </NoteInfo>
                      </Cell>
                      {/* add multi select */}
                      <Cell>
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
                      </Cell>
                    </TableRow>
                  )}
                  {property.type === "date-picker" && (
                    <TableRow>
                      <Cell>
                        <NoteInfo>
                          <Image src={multiSelect} alt="" /> {property.name}
                        </NoteInfo>
                      </Cell>
                      {/* add multi select */}
                      <Cell>
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
                      </Cell>
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
