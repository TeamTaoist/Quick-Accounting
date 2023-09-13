import styled from "@emotion/styled";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { ethers } from "ethers";

interface IProps {
  daoAddress: string;
  tokenAddress: string;
  onChange: (key: string, value: string) => void;
  onSearch: () => void;
}

export default function Search({
  daoAddress,
  tokenAddress,
  onChange,
  onSearch,
}: IProps) {
  const handleSearch = () => {
    // if (!daoAddress || !tokenAddress) {
    //   return;
    // }
    // if (
    //   !ethers.utils.isAddress(daoAddress) ||
    //   !ethers.utils.isAddress(tokenAddress)
    // ) {
    //   return;
    // }
    onSearch();
  };
  return (
    <PaperStyle elevation={3}>
      <SearchContainer>
        <InputItem>
          <FormControl variant="standard" fullWidth>
            <InputLabel shrink htmlFor="bootstrap-input">
              Dao Address
            </InputLabel>
            <BootstrapInput
              fullWidth
              defaultValue={daoAddress}
              value={daoAddress}
              onChange={(e) => onChange("dao", e.target.value)}
            />
          </FormControl>
        </InputItem>
        <InputItem>
          <FormControl variant="standard" fullWidth>
            <InputLabel shrink htmlFor="bootstrap-input">
              Token Address
            </InputLabel>
            <BootstrapInput
              defaultValue={tokenAddress}
              value={tokenAddress}
              onChange={(e) => onChange("token", e.target.value)}
            />
          </FormControl>
        </InputItem>
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </SearchContainer>
    </PaperStyle>
  );
}

const PaperStyle = styled(Paper)`
  width: 500px;
  margin: auto;
`;

const SearchContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 40px;
`;

const InputItem = styled.div`
  width: 100%;
`;

const BootstrapInput = styled(InputBase)(() => ({
  "label + &": {
    marginTop: "10px",
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    border: "1px solid",
    borderColor: "rgba(0, 0, 0, 0.6)",
    fontSize: 16,
    // padding: "10px 12px",
    marginTop: "10px",
    paddingInline: "10px",
  },
}));
