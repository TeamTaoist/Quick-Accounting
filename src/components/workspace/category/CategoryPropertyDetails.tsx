import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import option from "../../../assets/workspace/option.svg";
import select from "../../../assets/workspace/select.svg";
import multiSelect from "../../../assets/workspace/multi-select.svg";
import propertyAdd from "../../../assets/workspace/property-add.svg";
import propertyDelete from "../../../assets/workspace/property-delete.svg";
import {
  DetailsInput,
  DropdownOption,
  PropertyInput,
  PropertyInputValue,
  PropertyOptionsValue,
  PropertyOptionsValueBtn,
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
}

const CategoryPropertyDetails = ({
  showProperty,
  property,
  index,
  handleUpdateAddButtonClick,
  handlePropertyNameChange,
  handlePropertyTypeChange,
  handlePropertyValueChang,
  handleDeleteProperty,
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
            onChange={(e) =>
              handlePropertyNameChange(
                property.category_id,
                property.ID,
                e.target.value
              )
            }
            // onBlur={() =>
            //   handleUpdatedCategoryProperty(
            //     property.workspace_id,
            //     property.category_id,
            //     property.ID
            //   )
            // }
          />
          <h3>Property Type</h3>
          <Select
            labelId={`property-type-label-${index}`}
            id={`property-type-${index}`}
            value={property.type}
            onChange={(e) =>
              handlePropertyTypeChange(
                property.category_id,
                property.ID,
                e.target.value
              )
            }
            // onBlur={() =>
            //   handleUpdatedCategoryProperty(
            //     property.workspace_id,
            //     property.category_id,
            //     property.ID
            //   )
            // }
            size="small"
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
              "& fieldset": { border: 1 },
            }}
          >
            <MenuItem
              value="Text"
              sx={{
                "&:hover": {
                  backgroundColor: "var(--hover-bg)",
                },
                "&.Mui-selected": {
                  backgroundColor: "var(--hover-bg)",
                },
              }}
            >
              <DropdownOption>
                <img src={option} alt="" /> Text
              </DropdownOption>
            </MenuItem>
            <MenuItem value="single-select">
              <DropdownOption>
                <img src={select} alt="" /> Single-select
              </DropdownOption>
            </MenuItem>
            <MenuItem value="multi-select">
              <DropdownOption>
                <img src={multiSelect} alt="" />
                Multi-select
              </DropdownOption>
            </MenuItem>
            <MenuItem value="date-picker">
              <DropdownOption>
                <img src={multiSelect} alt="" />
                Datepicker
              </DropdownOption>
            </MenuItem>
          </Select>
          {/* property value */}
          {property.type !== "Text" && property.type !== "date-picker" && (
            <>
              {propertyValues.map((value, valueIndex) => (
                <PropertyOptionsValue>
                  <img src={propertyAdd} alt="" />
                  <PropertyInputValue
                    key={valueIndex}
                    placeholder=""
                    value={value}
                    onChange={(e) =>
                      handlePropertyValueChang(
                        property.category_id,
                        property.ID,
                        e.target.value,
                        valueIndex
                      )
                    }
                  />
                  <img
                    // onClick={() =>
                    //   handleUpdateDeleteProperty(
                    //     valueIndex,
                    //     property.workspace_id,
                    //     property.category_id,
                    //     property.ID
                    //   )
                    // }
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
                </PropertyOptionsValue>
              ))}
              <PropertyOptionsValueBtn
                onClick={() =>
                  handleUpdateAddButtonClick(property.category_id, property.ID)
                }
              >
                + Add option
              </PropertyOptionsValueBtn>
            </>
          )}
        </DetailsInput>
      )}
    </div>
  );
};

export default CategoryPropertyDetails;
