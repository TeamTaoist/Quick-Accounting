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
  propertyName: string;
  setPropertyName: (e: any) => void;
  handleUpdatedCategoryProperty: (
    workspaceId: number,
    categoryId: number,
    propertyId: number
  ) => void;
  index: number;
  propertyType: string;
  handleSetPropertyType: (e: any) => void;
  propertyValue: string[];
  handlePropertyValue: (index: number, newValue: string) => void;
  handleUpdateDeleteProperty: (
    index: number,
    workspaceId: number,
    categoryId: number,
    propertyID: number
  ) => void;
  handleUpdateAddButtonClick: () => void;
}

const CategoryPropertyDetails = ({
  showProperty,
  property,
  propertyName,
  setPropertyName,
  handleUpdatedCategoryProperty,
  index,
  propertyType,
  handleSetPropertyType,
  propertyValue,
  handlePropertyValue,
  handleUpdateDeleteProperty,
  handleUpdateAddButtonClick,
}: CategoryPropertyDetailsProps) => {
  return (
    <div>
      {showProperty === property.ID && (
        <DetailsInput>
          <h3>Property name</h3>
          <PropertyInput
            placeholder="Property name"
            // value={property.name}
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            onBlur={() =>
              handleUpdatedCategoryProperty(
                property.workspace_id,
                property.category_id,
                property.ID
              )
            }
          />
          <h3>Property Type</h3>
          <Select
            labelId={`property-type-label-${index}`}
            id={`property-type-${index}`}
            // value={property.type}
            value={propertyType}
            onChange={(e) => handleSetPropertyType(e)}
            onBlur={() =>
              handleUpdatedCategoryProperty(
                property.workspace_id,
                property.category_id,
                property.ID
              )
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
          {propertyType !== "Text" && (
            <>
              {propertyValue.map((value, valueIndex) => (
                <PropertyOptionsValue>
                  <img src={propertyAdd} alt="" />
                  <PropertyInputValue
                    key={valueIndex}
                    placeholder=""
                    value={value}
                    onChange={(e) =>
                      handlePropertyValue(valueIndex, e.target.value)
                    }
                    onBlur={() =>
                      handleUpdatedCategoryProperty(
                        property.workspace_id,
                        property.category_id,
                        property.ID
                      )
                    }
                  />
                  <img
                    onClick={() =>
                      handleUpdateDeleteProperty(
                        valueIndex,
                        property.workspace_id,
                        property.category_id,
                        property.ID
                      )
                    }
                    src={propertyDelete}
                    alt=""
                  />
                </PropertyOptionsValue>
              ))}
              <PropertyOptionsValueBtn onClick={handleUpdateAddButtonClick}>
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
