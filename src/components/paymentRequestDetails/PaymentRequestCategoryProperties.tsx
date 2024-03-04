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
  return (
    <>
      {selectedCategory?.properties?.map((property: any) => (
        <React.Fragment key={property.ID}>
          {property.type === "single-select" && (
            <SingleSelectType
              property={property}
              handleUpdateCategory={handleUpdateCategory}
              status={status}
              selectSingleValue={selectSingleValue}
              handleSelectSingleChange={handleSelectSingleChange}
              parseCategoryProperties={parseCategoryProperties}
              defaultPropertyValue={
                parseCategoryProperties?.filter(
                  (p: any) =>
                    (p.type === "single-select" && p.name) === property.name
                )[0]
              }
            />
          )}
        </React.Fragment>
      ))}
      {selectedCategory?.properties?.map((property: any, index: number) => (
        <>
          {property.type === "multi-select" && (
            <MultiSelectType
              property={property}
              handleUpdateCategory={handleUpdateCategory}
              status={status}
              selectedValues={selectedValues}
              handleSelectChange={handleSelectChange}
              parseCategoryProperties={parseCategoryProperties}
              defaultPropertyValue={
                parseCategoryProperties?.filter(
                  (p: any) =>
                    (p.type === "multi-select" && p.name) === property.name
                )[0]
              }
            />
          )}
        </>
      ))}
      {selectedCategory.properties?.map((property: any) => (
        <>
          {property.type === "Text" && (
            <TextType
              property={property}
              handleUpdateCategory={handleUpdateCategory}
              proPertyTextValue={proPertyTextValue}
              handlePropertyText={handlePropertyText}
              status={status}
              defaultPropertyValue={
                parseCategoryProperties?.filter(
                  (p: any) => (p.type === "Text" && p.name) === property.name
                )[0]
              }
            />
          )}
        </>
      ))}
      {selectedCategory.properties?.map((property: any) => (
        <>
          {property.type === "date-picker" && (
            <TextType
              property={property}
              handleUpdateCategory={handleUpdateCategory}
              proPertyTextValue={proPertyTextValue}
              handlePropertyText={handlePropertyText}
              status={status}
              defaultPropertyValue={
                parseCategoryProperties?.filter(
                  (p: any) =>
                    (p.type === "date-picker" && p.name) === property.name
                )[0]
              }
            />
          )}
        </>
      ))}
    </>
  );
};

export default PaymentRequestCategoryProperties;
