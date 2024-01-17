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
import useAsync from "../../../hooks/useAsync";
import {
  getBalances,
  SafeBalanceResponse,
} from "@safe-global/safe-gateway-typescript-sdk";
import { formatBalance, getShortDisplay } from "../../../utils/number";
import { useWorkspace } from "../../../store/useWorkspace";
import CHAINS from "../../../utils/chain";

type AssetType = {
  name: string;
  symbol: string;
  price: string;
  priceIncrease: string;
  balance: string;
  balanceDisplay: string;
  balanceUSD: string;
  address: string;
  link: string;
};

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
  const { workspace } = useWorkspace();

  const [data, error, loading] = useAsync<SafeBalanceResponse>(
    () => {
      return getBalances(String(workspace?.chain_id), workspace?.vault_wallet);
    },
    [workspace],
    false
  );
  const totalValue = getShortDisplay(data?.fiatTotal || 0);
  console.log(data, error, loading);
  const chainData = CHAINS.find((c) => c.chainId === workspace?.chain_id);

  const filterList: AssetType[] =
    data?.items
      ?.map((item) => ({
        name: item.tokenInfo.name,
        symbol: item.tokenInfo.symbol,
        price: item.fiatConversion,
        priceIncrease: "0", // TODO not found data
        balance: item.balance,
        balanceDisplay: formatBalance(item.balance, item.tokenInfo.decimals),
        balanceUSD: Number(item.fiatBalance).format(),
        address: item.tokenInfo.address,
        link:
          item.tokenInfo.type === "NATIVE_TOKEN"
            ? ""
            : `${chainData?.explore}/token/${item.tokenInfo.address}`, // TODO check current safe chain
      }))
      .filter((data) =>
        data.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

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
        <AssetValue>Value: ${totalValue}</AssetValue>
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
                {filterList.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {/* {recipientFormate(row.assetsName)} */}
                      <RowCell>
                        <h6>{data.symbol}</h6>
                        <p>{data.name}</p>
                      </RowCell>
                    </TableCell>
                    <TableCell>
                      <RowCell>
                        <h6>$ {data.price}</h6>
                        <p style={{ color: "#2F82CF" }}>
                          (+{data.priceIncrease}%)
                        </p>
                      </RowCell>
                    </TableCell>
                    <TableCell>
                      <RowCell>
                        <h6>
                          {data.balanceDisplay} {data.symbol}
                        </h6>
                        <p>${data.balanceUSD}</p>
                      </RowCell>
                    </TableCell>
                    <TableCell>
                      {data.link && (
                        <RowLink>
                          <a href={data.link} target="_blank" rel="noreferrer">
                            <img src={linkIcon} alt="" />
                          </a>
                        </RowLink>
                      )}
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
