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
import { NoteInfo } from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
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
        <TableBody>
          <TableRow
            sx={{
              td: {
                border: "1px solid var(--border-table)",
                padding: 0,
                paddingInline: "16px",
              },
            }}
          >
            <TableCell sx={{ height: 1, width: "33.5%" }}>
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
                    "& fieldset": { border: "none" },
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
                          backgroundColor: "var(--hover-bg)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "var(--hover-bg)",
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
                          border: "1px solid var(--border-table)",
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell sx={{ height: 1, width: 252 }}>
                        <NoteInfo>
                          <Image src={selectIcon} alt="" /> {property.name}
                        </NoteInfo>
                      </TableCell>
                      {/* add multi select first */}
                      <TableCell>
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
                          border: "1px solid var(--border-table)",
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell sx={{ height: 1, width: 252 }}>
                        <NoteInfo>
                          <Image src={multiSelect} alt="" /> {property.name}
                        </NoteInfo>
                      </TableCell>
                      {/* add multi select */}
                      <TableCell>
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
                          border: "1px solid var(--border-table)",
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell sx={{ height: 1, width: 252 }}>
                        <NoteInfo>
                          <Image src={optionsIcon} alt="" /> {property.name}
                        </NoteInfo>
                      </TableCell>
                      {/* add multi select */}
                      <TableCell>
                        <TextField
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
