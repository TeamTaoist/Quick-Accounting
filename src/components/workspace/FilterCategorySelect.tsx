import { FormControl, MenuItem, Select } from "@mui/material";
import {
  Image,
  Option,
} from "../../pages/workspace/paymentRequest/paymentRequest.style";
import filterIcon from "../../assets/workspace/filtering.svg";
import { useTranslation } from "react-i18next";

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
    <FormControl sx={{ marginLeft: "14px", minWidth: 200 }}>
      <Select
        value={selectedValue}
        onChange={handleDropdownChange}
        displayEmpty
        inputProps={{ "aria-label": "Select a value" }}
        size="small"
        sx={{ overflow: "hidden" }}
        // renderValue={(selectedValue) => (
        //   <div style={{ overflow: "hidden" }}>{selectedValue}</div>
        // )}
        MenuProps={{
          sx: {
            "& .MuiMenuItem-root": {
              marginInline: "10px",
              borderRadius: "6px",
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
        <MenuItem value="" disabled>
          <Option>
            <Image src={filterIcon} alt="" />
            {t("paymentRequest.Filter")}
          </Option>
        </MenuItem>
        {uniqueCategoryNames.map(
          (categoryName) =>
            categoryName.trim() !== "" && (
              <MenuItem value={categoryName} key={categoryName}>
                {categoryName}
              </MenuItem>
            )
        )}
      </Select>
    </FormControl>
  );
};

export default FilterCategorySelect;
