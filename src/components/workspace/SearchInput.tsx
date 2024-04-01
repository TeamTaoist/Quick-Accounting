import { InputAdornment, TextField } from "@mui/material";
import searchIcon from "../../assets/workspace/search-icon.svg";

interface SearchInputProps {
  handleSearchPayment: (e: any) => void;
  placeholder: string;
  searchTerm: string;
  handleChange: (e: any) => void;
  width?: string;
}

const SearchInput = ({
  handleSearchPayment,
  placeholder,
  searchTerm,
  handleChange,
  width = "auto",
}: SearchInputProps) => {
  return (
    <form onSubmit={handleSearchPayment}>
      <TextField
        id="search"
        type="search"
        autoComplete="off"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        sx={{
          width: width,
          "& fieldset.MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--clr-gray-300)",
            borderRadius: "6px",
            backgroundColor: "#fff",
          },
          "& .MuiInputBase-input": {
            height: "23px",
          },
        }}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img style={{ width: "16px" }} src={searchIcon} alt="" />
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};

export default SearchInput;
