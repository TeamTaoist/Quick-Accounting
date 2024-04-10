import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import arrowBottom from "../assets/workspace/arrow-bottom.svg";
import removeIcon from "../assets/x-circle.svg";
import checkIcon from "../assets/dropdown-check.svg";

const animatedComponents = makeAnimated();

export const customStyles: any = {
  placeholder: (defaultStyles: any) => ({
    ...defaultStyles,
    color: "var(--clr-gray-400)",
    fontSize: "14px",
    fontFamily: "Inter",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    border: "1px solid var(--clr-gray-200)",
    borderRadius: "6px",
    margin: "4px 0",
    padding: "2px 8px",
    height: "40px",
    boxShadow: state.isFocused ? null : null,
    backgroundColor: state.isDisabled
      ? "transparent"
      : provided.backgroundColor,
    "&:hover": {
      border: "1px solid var(--clr-gray-200)",
    },
    fontSize: "14px",
    fontFamily: "Inter",
    color: "#0F172A",
  }),
  option: (provided: any, state: any) => (
    console.log("state", state),
    {
      ...provided,
      backgroundColor: (state.isFocused || state.isSelected) && "#E2E8F0",
      color: "#0F172A",
      fontSize: "14px",
      fontFamily: "Inter",
      margin: "4px",
      maxWidth: "calc(100% - 16px)",
      borderRadius: "6px",
      "&::hover": {
        backgroundColor: "#E2E8F0",
      },
    }
  ),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#0F172A",
    fontSize: "14px",
    fontFamily: "Inter",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    border: "1px solid #E2E8F0",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "Inter",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    // color: "#333",
    color: "#0F172A",
    fontSize: "14px",
    fontFamily: "Inter",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#475569",
    border: "1px solid red",
    width: "13px",
    height: "13px",
    ":hover": {
      color: "##d9d9d9",
    },
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
};
// dropdown arrow icon
const ArrowIcon = (props: any) => {
  return (
    <div>
      <div {...props} style={{ marginRight: "11px" }}>
        <img
          src={arrowBottom}
          alt="Dropdown Indicator"
          style={{ width: 16, height: 16 }}
        />
      </div>
    </div>
  );
};
//remove icon
const RemoveIcon = ({ innerProps }: any) => {
  return (
    <div
      {...innerProps}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "3px",
      }}
    >
      <img
        src={removeIcon}
        alt="Custom Remove Icon"
        style={{ width: 16, height: 16 }}
      />
    </div>
  );
};
// option icon
const OptionWithIcon = ({ label, isSelected, innerProps }: any) => (
  <div
    {...innerProps}
    style={{
      display: "flex",
      alignItems: "center",
      backgroundColor: isSelected ? "#E2E8F0" : "inherit",
      color: isSelected ? "#0F172A" : "inherit",
      fontSize: "14px",
      fontFamily: "Inter",
      margin: "4px",
      maxWidth: "calc(100% - 16px)",
      borderRadius: "6px",
      padding: "6px",
      ":hover": {
        backgroundColor: "#CDD6E0",
      },
    }}
  >
    {isSelected && (
      <img
        src={checkIcon}
        alt="Option Icon"
        style={{ width: 16, height: 16, marginRight: 6 }}
      />
    )}
    <div
      style={{
        marginLeft: isSelected ? 0 : "22px",
      }}
    >
      {label}
    </div>
  </div>
);

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
      // components={animatedComponents}
      components={{
        ...animatedComponents,
        DropdownIndicator: ArrowIcon,
        IndicatorSeparator: () => null,
        MultiValueRemove: RemoveIcon,
        Option: OptionWithIcon,
        // SingleValue: OptionWithIcon,
      }}
      isMulti={isMulti}
      options={options}
      styles={customStyles}
      onChange={onChange}
      menuPortalTarget={document.body}
      // isClearable={false}
      isDisabled={isDisabled}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: "var(--clr-gray-200)",
        },
      })}
    />
  );
}
