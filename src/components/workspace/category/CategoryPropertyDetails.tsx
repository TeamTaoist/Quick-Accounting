import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import option from "../../../assets/workspace/option.svg";
import select from "../../../assets/workspace/select.svg";
import multiSelect from "../../../assets/workspace/multi-select.svg";
import calendar from "../../../assets/workspace/calendar.svg";
import propertyAdd from "../../../assets/workspace/property-add.svg";
import propertyDelete from "../../../assets/workspace/property-delete.svg";
import add from "../../../assets/workspace/add.svg";
import {
  DeleteValue,
  DetailsInput,
  DropdownOption,
  PropertyInput,
  PropertyInputValue,
  PropertyOptionsValue,
  PropertyOptionsValueBtn,
  ValueIcon,
} from "../../../pages/workspace/category/category.style";
import { InputAdornment, MenuItem, Select } from "@mui/material";
interface CategoryPropertyDetailsProps {
  showProperty: number | null | undefined;
  property: ICategoryProperties;
  index: number;
  handleUpdateAddButtonClick: (categoryId: number, propertyId: number) => void;
  handlePropertyNameChange: (
    categoryId: number,
    propertyId: number,
    newName: string
  ) => void;
  handlePropertyTypeChange: (
    categoryId: number,
    propertyId: number,
    newName: string
  ) => void;
  handlePropertyValueChang: (
    categoryId: number,
    propertyId: number,
    newName: string,
    index: number
  ) => void;
  handleDeleteProperty: (
    categoryId: number,
    propertyId: number,
    index: number
  ) => void;
  isEditable: boolean;
}

const MenuItemStyle = {
  paddingInline: "5px",
  fontSize: "14px",
  fontWeight: "500",
  marginInline: "10px",
  borderRadius: "6px",
  margin: "5px 8px",
  height: "32px",
  "&:hover": {
    backgroundColor: "var(--clr-gray-100)",
  },
  "&.Mui-selected": {
    backgroundColor: "var(--clr-gray-200)",
  },
};

const CategoryPropertyDetails = ({
  showProperty,
  property,
  index,
  handleUpdateAddButtonClick,
  handlePropertyNameChange,
  handlePropertyTypeChange,
  handlePropertyValueChang,
  handleDeleteProperty,
  isEditable,
}: CategoryPropertyDetailsProps) => {
  const propertyValues = property.values?.split(";");
  return (
    <div>
      {(showProperty === property.ID || showProperty === index) && (
        <DetailsInput>
          <h3>Property name</h3>
          <PropertyInput
            placeholder="Property name"
            value={property.name}
            disabled={isEditable}
            onChange={(e) =>
              handlePropertyNameChange(
                property.category_id,
                property.ID,
                e.target.value
              )
            }
            style={
              isEditable
                ? { background: "#F1F5F9" }
                : { background: "transparent" }
            }
          />
          <h3>Property Type</h3>
          <Select
            labelId={`property-type-label-${index}`}
            id={`property-type-${index}`}
            value={property.type}
            disabled={isEditable}
            onChange={(e) =>
              handlePropertyTypeChange(
                property.category_id,
                property.ID,
                e.target.value
              )
            }
            style={
              isEditable
                ? {
                    background: "#F1F5F9",
                  }
                : { background: "transparent" }
            }
            size="small"
            IconComponent={() => (
              <InputAdornment position="start">
                <img
                  src={arrowBottom}
                  alt="Custom Arrow Icon"
                  style={{ marginRight: "6px", width: "16px", height: "16px" }}
                />
              </InputAdornment>
            )}
            sx={{
              overflow: "hidden",
              minWidth: "100%",
              height: "36px",
              padding: 0,
              // paddingInline: "1px",
              "& .MuiSelect-select": {
                display: "block",
                fontSize: "14px",
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
              "& .MuiInputLabel-root": { display: "none" },
            }}
            // MenuProps={{
            //   sx: {
            //     "& .MuiMenuItem-root": {
            //       marginInline: "10px",
            //       borderRadius: "6px",
            //       margin: "4px 6px",
            //       "&:hover": {
            //         bgcolor: "var(--clr-gray-100)",
            //       },
            //       "&.Mui-selected": {
            //         bgcolor: "var(--clr-gray-100)",
            //       },
            //     },
            //   },
            // }}
          >
            <MenuItem value="Text" sx={MenuItemStyle}>
              <DropdownOption>
                <img src={option} alt="" /> Text
              </DropdownOption>
            </MenuItem>
            <MenuItem value="single-select" sx={MenuItemStyle}>
              <DropdownOption>
                <img src={select} alt="" /> Single-select
              </DropdownOption>
            </MenuItem>
            <MenuItem value="multi-select" sx={MenuItemStyle}>
              <DropdownOption>
                <img src={multiSelect} alt="" />
                Multi-select
              </DropdownOption>
            </MenuItem>
            <MenuItem value="date-picker" sx={MenuItemStyle}>
              <DropdownOption>
                <img src={calendar} alt="" />
                Datepicker
              </DropdownOption>
            </MenuItem>
          </Select>
          {/* property value */}
          {property.type !== "Text" && property.type !== "date-picker" && (
            <>
              {propertyValues.map((value, valueIndex) => (
                <PropertyOptionsValue>
                  <ValueIcon src={propertyAdd} alt="" />
                  <PropertyInputValue
                    key={valueIndex}
                    placeholder={`Option ${valueIndex + 1}`}
                    value={value}
                    disabled={isEditable}
                    onChange={(e) =>
                      handlePropertyValueChang(
                        property.category_id,
                        property.ID,
                        e.target.value,
                        valueIndex
                      )
                    }
                    style={
                      isEditable
                        ? { background: "#F1F5F9" }
                        : { background: "transparent" }
                    }
                  />
                  {!isEditable && (
                    <DeleteValue
                      onClick={() =>
                        handleDeleteProperty(
                          property.category_id,
                          property.ID,
                          valueIndex
                        )
                      }
                      src={propertyDelete}
                      alt=""
                    />
                  )}
                </PropertyOptionsValue>
              ))}
              {!isEditable && (
                <PropertyOptionsValueBtn
                  onClick={() =>
                    handleUpdateAddButtonClick(
                      property.category_id,
                      property.ID
                    )
                  }
                >
                  <img src={add} alt="" /> Add option
                </PropertyOptionsValueBtn>
              )}
            </>
          )}
        </DetailsInput>
      )}
    </div>
  );
};

export default CategoryPropertyDetails;
