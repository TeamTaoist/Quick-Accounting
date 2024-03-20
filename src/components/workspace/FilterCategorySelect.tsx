import { FormControl, MenuItem, Select } from "@mui/material";
import {
  Image,
  Option,
} from "../../pages/workspace/paymentRequest/paymentRequest.style";
import filterIcon from "../../assets/workspace/filtering.svg";
import { useTranslation } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import { Item } from "../../pages/workspace/WorkSpaceForm.style";

interface FilterCategorySelectProps {
  selectedValue: string;
  handleDropdownChange: (event: any) => void;
  uniqueCategoryNames: Array<any>;
}

const FilterCategorySelect = ({
  selectedValue,
  handleDropdownChange,
  uniqueCategoryNames,
}: FilterCategorySelectProps) => {
  const { t } = useTranslation();
  return (
    <FormControl sx={{ marginLeft: "14px", minWidth: 240 }}>
      <Select
        value={selectedValue}
        renderValue={(selected) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Inter",
            }}
          >
            {selected ? (
              selected
            ) : (
              <>
                <img
                  src={filterIcon}
                  alt="Selected Icon"
                  style={{ marginRight: "8px", width: "16px", height: "16px" }}
                />
                <div style={{ overflow: "hidden", fontSize: "14px" }}>
                  Filter by Category
                </div>
              </>
            )}
          </div>
        )}
        onChange={handleDropdownChange}
        displayEmpty
        inputProps={{ "aria-label": "Select a value" }}
        size="small"
        // sx={{ overflow: "hidden" }}
        sx={{
          minWidth: "100%",
          height: "40px",
          padding: 0,
          paddingInline: "1px",
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
        // renderValue={(selectedValue) => (
        //   <div style={{ overflow: "hidden" }}>{selectedValue}</div>
        // )}
        MenuProps={{
          sx: {
            "& .MuiMenuItem-root": {
              marginInline: "10px",
              borderRadius: "6px",
              fontFamily: "Inter",
              // border: "1px solid var(--clr-gray-300)",
              "&:hover": {
                bgcolor: "var(--clr-gray-100)",
                borderRadius: "6px",
              },
              "&.Mui-selected": {
                bgcolor: "var(--clr-gray-100)",
              },
            },
          },
        }}
      >
        {/* <MenuItem value="" disabled>
          <Option>
            <Image src={filterIcon} alt="" />
            {t("paymentRequest.Filter")}
          </Option>
        </MenuItem> */}
        {uniqueCategoryNames.map(
          (categoryName) =>
            categoryName.trim() !== "" && (
              <MenuItem value={categoryName} key={categoryName}>
                <Item>
                  <div
                    style={{
                      width: "14px",
                      marginRight: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {selectedValue === categoryName && (
                      <CheckIcon style={{ color: "#334155", width: "16px" }} />
                    )}
                  </div>

                  {categoryName}
                </Item>
              </MenuItem>
            )
        )}
      </Select>
    </FormControl>
  );
};

export default FilterCategorySelect;
