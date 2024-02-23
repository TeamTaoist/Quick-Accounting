import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import option from "../../../assets/workspace/option.svg";
import select from "../../../assets/workspace/select.svg";
import multiSelect from "../../../assets/workspace/multi-select.svg";
import propertyAdd from "../../../assets/workspace/property-add.svg";
import propertyDelete from "../../../assets/workspace/property-delete.svg";
import { InputAdornment, MenuItem, Select } from "@mui/material";
import {
  CategoryPropertiesState,
  CategoryProperty,
} from "../../../pages/workspace/category/Category";
import {
  DetailsInput,
  DropdownOption,
  PropertyInput,
  PropertyInputValue,
  PropertyOptionsValue,
  PropertyOptionsValueBtn,
} from "../../../pages/workspace/category/category.style";
import { CategoryProperties } from "../../../store/useCategoryProperty";

interface LocalCategoryPropertyDetailsProps {
  showProperty: number | null | undefined;
  property: CategoryProperty;
  index: number;
  handlePropertyNameChange: (
    categoryId: number,
    index: number,
    newName: string
  ) => void;
  category: CategoryProperties;
  handlePropertyTypeChange: (
    categoryId: number,
    index: number,
    newType: string
  ) => void;
  propertyValues: string[];
  handlePropertyValueChang: (
    categoryId: number,
    index: number,
    newValue: string
  ) => void;
  handleAddButtonClick: (categoryId: number, index: number) => void;
  handleDeleteProperty: (index: number) => void;
}

const LocalCategoryPropertyDetails = ({
  showProperty,
  property,
  index,
  handlePropertyNameChange,
  category,
  handlePropertyTypeChange,
  propertyValues,
  handlePropertyValueChang,
  handleAddButtonClick,
  handleDeleteProperty,
}: LocalCategoryPropertyDetailsProps) => {
  return (
    <div>
      {showProperty === index && (
        <DetailsInput>
          <h3>Property name</h3>
          <PropertyInput
            placeholder="Property name"
            value={property.name}
            onChange={(e) =>
              handlePropertyNameChange(category.ID, index, e.target.value)
            }
          />
          <h3>Property Type</h3>
          <Select
            labelId={`property-type-label-${index}`}
            id={`property-type-${index}`}
            value={property.type}
            onChange={(e) =>
              handlePropertyTypeChange(category.ID, index, e.target.value)
            }
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
          </Select>
          {/* property value */}
          {property.type !== "Text" && (
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
                        category.ID,
                        valueIndex,
                        e.target.value
                      )
                    }
                  />
                  <img
                    onClick={() => handleDeleteProperty(valueIndex)}
                    src={propertyDelete}
                    alt=""
                  />
                </PropertyOptionsValue>
              ))}
              <PropertyOptionsValueBtn
                onClick={() => handleAddButtonClick(category.ID, index)}
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

export default LocalCategoryPropertyDetails;
