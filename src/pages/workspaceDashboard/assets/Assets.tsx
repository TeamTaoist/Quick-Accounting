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
                  <TableCell sx={{ textAlign: "center" }}>Assets</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Current price
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Balance</TableCell>
                  <TableCell sx={{ textAlign: "center" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.assetsName}>
                    <TableCell>
                      {/* {recipientFormate(row.assetsName)} */}
                      <RowCell>
                        <h6>{row.assetsName}</h6>
                        <p>{row.asset}</p>
                      </RowCell>
                    </TableCell>
                    <TableCell>
                      <RowCell>
                        <h6>$ {row.currentBalance}</h6>
                        <p style={{ color: "#2F82CF" }}>(+{row.balance}%)</p>
                      </RowCell>
                    </TableCell>
                    <TableCell>
                      <RowCell>
                        <h6>
                          {row.price} {row.assetsName}
                        </h6>
                        <p>{row.priceIncrease}</p>
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
