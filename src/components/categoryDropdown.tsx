import styled from "@emotion/styled";
import { InputAdornment, MenuItem, Select } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import arrowBottom from "../assets/workspace/arrow-bottom.svg";

const CategoryDropdown = ({ value, data, onClick }: any) => {
  return (
    <div>
      <Select
        fullWidth
        size="small"
        value={value}
        IconComponent={() => (
          <InputAdornment position="start">
            <img
              src={arrowBottom}
              alt="Custom Arrow Icon"
              style={{ marginRight: "20px" }}
            />
          </InputAdornment>
        )}
        renderValue={(selectedValue) => (
          <div style={{ overflow: "hidden", fontSize: "14px" }}>
            {selectedValue}
          </div>
        )}
        MenuProps={{
          sx: {
            "& .MuiMenuItem-root": {
              marginInline: "10px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              margin: "5px 8px",
              "&:hover": {
                bgcolor: "var(--clr-gray-100)",
              },
              "&.Mui-selected": {
                bgcolor: "var(--clr-gray-100)",
              },
            },
          },
        }}
        sx={{
          overflow: "hidden",
          minWidth: "100%",
          height: "42px",
          padding: 0,
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
          "& .MuiInputLabel-root": { display: "none" },
        }}
      >
        {data.map((item: any) => (
          <MenuItem
            value={item.name}
            key={item}
            onClick={() => onClick(item)}
            sx={{
              paddingInline: "5px",
              fontSize: "14px",
              "&:hover": {
                backgroundColor: "var(--clr-gray-100)",
              },
              "&.Mui-selected": {
                backgroundColor: "var(--clr-gray-200)",
              },
            }}
          >
            <Item>
              <div
                style={{
                  width: "14px",
                  marginRight: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {value === item.name && (
                  <CheckIcon style={{ color: "#334155", width: "16px" }} />
                )}
              </div>

              {item.name}
            </Item>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default CategoryDropdown;

export const Item = styled.div`
  display: flex;
  align-items: center;
`;
