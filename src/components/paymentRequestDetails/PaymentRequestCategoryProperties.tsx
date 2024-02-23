import React from "react";
import SingleSelectType from "./SingleSelectType";
import MultiSelectType from "./MultiSelectType";
import TextType from "./TextType";
import { ReactSelectOption } from "../../pages/workspace/paymentRequest/PaymentRequestDetails";

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
              <TextType
                property={property}
                handleUpdateCategory={handleUpdateCategory}
                proPertyTextValue={proPertyTextValue}
                handlePropertyText={handlePropertyText}
                status={status}
              />
            ) : (
              !property.archived && (
                <TextType
                  property={property}
                  handleUpdateCategory={handleUpdateCategory}
                  proPertyTextValue={proPertyTextValue}
                  handlePropertyText={handlePropertyText}
                  status={status}
                />
              )
            ))}
        </>
      ))}
    </>
  );
};

export default PaymentRequestCategoryProperties;
