import { useState } from "react";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import {
  AssetHeader,
  AssetSection,
  AssetTable,
  AssetValue,
  RowCell,
  RowLink,
} from "./assets.style";
import { InputAdornment, TextField } from "@mui/material";
import searchIcon from "../../../assets/workspace/search-icon.svg";
import linkIcon from "../../../assets/workspace/link-icon.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const tableData = [
  {
    assetsName: "USDT",
    asset: "Teather",
    price: "2.22",
    priceIncrease: "1.11",
    currentBalance: "12423.34",
    balance: "342.22",
    link: "",
  },
  {
    assetsName: "Polygon",
    asset: "Polygon",
    price: "2.22",
    priceIncrease: "1.11",
    currentBalance: "12423.34",
    balance: "342.22",
    link: "",
  },
  {
    assetsName: "ETH",
    asset: "ETH",
    price: "2.22",
    priceIncrease: "1.11",
    currentBalance: "12423.34",
    balance: "342.22",
    link: "",
  },
  {
    assetsName: "MATIC",
    asset: "Polygon",
    price: "2.22",
    priceIncrease: "1.11",
    currentBalance: "12423.34",
    balance: "342.22",
    link: "",
  },
  {
    assetsName: "MATIC",
    asset: "Polygon",
    price: "2.22",
    priceIncrease: "1.11",
    currentBalance: "12423.34",
    balance: "342.22",
    link: "",
  },
  {
    assetsName: "ETH",
    asset: "Polygon",
    price: "2.22",
    priceIncrease: "1.11",
    currentBalance: "12423.34",
    balance: "342.22",
    link: "",
  },
  {
    assetsName: "MATIC",
    asset: "Polygon",
    price: "2.22",
    priceIncrease: "1.11",
    currentBalance: "12423.34",
    balance: "342.22",
    link: "",
  },
];
const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};
const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  console.log(searchTerm);

  // filter table data
  const filterData = tableData.filter((data) =>
    data.assetsName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //table
  return (
    <WorkspaceLayout>
      <AssetSection>
        <AssetHeader>
          <TextField
            id="search"
            type="search"
            placeholder={t("assets.SearchPlaceholder")}
            value={searchTerm}
            onChange={handleChange}
            sx={{ width: 350 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={searchIcon} alt="" />
                </InputAdornment>
              ),
            }}
          />
        </AssetHeader>
        <AssetValue>Value: $12,345</AssetValue>
        <AssetTable>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 500, minWidth: 630 }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      background: "var(--bg-primary)",
                    }}
                  >
                    Assets
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      background: "var(--bg-primary)",
                    }}
                  >
                    Current price
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      background: "var(--bg-primary)",
                    }}
                  >
                    Balance
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      background: "var(--bg-primary)",
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {/* {recipientFormate(row.assetsName)} */}
                      <RowCell>
                        <h6>{data.assetsName}</h6>
                        <p>{data.asset}</p>
                      </RowCell>
                    </TableCell>
                    <TableCell>
                      <RowCell>
                        <h6>$ {data.currentBalance}</h6>
                        <p style={{ color: "#2F82CF" }}>(+{data.balance}%)</p>
                      </RowCell>
                    </TableCell>
                    <TableCell>
                      <RowCell>
                        <h6>
                          {data.price} {data.assetsName}
                        </h6>
                        <p>{data.priceIncrease}</p>
                      </RowCell>
                    </TableCell>
                    <TableCell>
                      <RowLink>
                        <a href="">
                          <img src={linkIcon} alt="" />
                        </a>
                      </RowLink>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AssetTable>
      </AssetSection>
    </WorkspaceLayout>
  );
};

export default Assets;
