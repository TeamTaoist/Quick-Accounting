import { InputAdornment, TextField } from "@mui/material";
import searchIcon from "../../assets/workspace/search-icon.svg";

interface SearchInputProps {
  handleSearchPayment: (e: any) => void;
  placeholder: string;
  searchTerm: string;
  handleChange: (e: any) => void;
}

const SearchInput = ({
  handleSearchPayment,
  placeholder,
  searchTerm,
  handleChange,
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
          width: 350,
        }}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src={searchIcon} alt="" />
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};

export default SearchInput;
