import {
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SvgIcon,
} from "@mui/material";
import filterIcon from "../../assets/workspace/filtering.svg";
import arrowBottom from "../../assets/workspace/arrow-bottom.svg";
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
    <FormControl
      sx={{
        marginLeft: "14px",
        minWidth: "240px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "4px",
      }}
    >
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
        IconComponent={() => (
          <InputAdornment position="start">
            <img
              src={arrowBottom}
              alt="Custom Arrow Icon"
              style={{ marginRight: "10px" }}
            />
          </InputAdornment>
        )}
        // sx={{ overflow: "hidden" }}
        sx={{
          minWidth: "100%",
          height: "40px",
          backgroundColor: "var(--clr-white)",
          // margin: "4px",
          paddingInline: "1px",
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
              fontSize: "14px",
              fontWeight: "500",
              margin: "5px",
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

      {!!selectedValue && (
        <IconButton
          onClick={() => handleDropdownChange({ target: { value: "" } })}
        >
          <SvgIcon>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.00016 14.6666C11.6821 14.6666 14.6668 11.6818 14.6668 7.99992C14.6668 4.31802 11.6821 1.33325 8.00016 1.33325C4.31826 1.33325 1.3335 4.31802 1.3335 7.99992C1.3335 11.6818 4.31826 14.6666 8.00016 14.6666Z"
                fill="#E2E8F0"
              />
              <path
                d="M10 6L6 10"
                stroke="#475569"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 6L10 10"
                stroke="#475569"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </SvgIcon>
        </IconButton>
      )}
    </FormControl>
  );
};

export default FilterCategorySelect;
