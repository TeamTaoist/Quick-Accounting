import { useState } from "react";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import { AssetHeader, AssetSection, AssetTable, RowCell } from "./assets.style";
import { Container, InputAdornment, TextField } from "@mui/material";
import searchIcon from "../../../assets/workspace/search-icon.svg";
import linkIcon from "../../../assets/workspace/link-icon.svg";

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
];

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
            placeholder="Search Token"
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
        <AssetTable>
          {/* <h3>Value: $ 28,478,450</h3> */}
          <table>
            <thead>
              <tr>
                <th>Assets</th>
                <th>Current price</th>
                <th>Balance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((data) => (
                <tr>
                  <td>
                    <RowCell>
                      <h6>{data.assetsName}</h6>
                      <p>{data.asset}</p>
                    </RowCell>
                  </td>
                  <td>
                    <RowCell>
                      <h6>$ {data.currentBalance}</h6>
                      <p style={{ color: "#2F82CF" }}>(+{data.balance}%)</p>
                    </RowCell>
                  </td>
                  <td>
                    <RowCell>
                      <h6>
                        {data.price} {data.assetsName}
                      </h6>
                      <p>{data.priceIncrease}</p>
                    </RowCell>
                  </td>
                  <td>
                    <a href="">
                      <img src={linkIcon} alt="" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AssetTable>
      </AssetSection>
    </WorkspaceLayout>
  );
};

export default Assets;
