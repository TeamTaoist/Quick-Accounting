import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export const customStyles: any = {
  control: (provided: any, state: any) => ({
    ...provided,
    border: "1px solid var(--clr-gray-200)",
    borderRadius: "6px",
    margin: "4px 0",
    padding: "2px 4px",
    color: "var(--clr-primary-900)",
    boxShadow: state.isFocused ? null : null,
    backgroundColor: state.isDisabled
      ? "transparent"
      : provided.backgroundColor,
    "&:hover": {
      border: "1px solid var(--clr-gray-200)",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused && "#E2E8F0",
    color: "#222121",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#E2E8F0",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#333",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#475569",
    ":hover": {
      color: "##d9d9d9",
    },
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
};

export default function ReactSelect({
  value,
  onChange,
  options = [],
  isMulti = true,
  defaultValues = [],
  isDisabled = false,
}: any) {
  return (
    <Select
      closeMenuOnSelect={!isMulti}
      defaultValue={defaultValues}
      components={animatedComponents}
      isMulti={isMulti}
      options={options}
      styles={customStyles}
      onChange={onChange}
      menuPortalTarget={document.body}
      // isClearable={false}
      isDisabled={isDisabled}
    />
  );
}
