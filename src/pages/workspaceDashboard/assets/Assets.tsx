import { useEffect, useState } from "react";
import {
  AssetHeader,
  AssetSection,
  AssetTable,
  AssetValue,
  RowCell,
  RowLink,
} from "./assets.style";
import { InputAdornment, Switch, SwitchProps, TextField } from "@mui/material";
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
import { formatBalance } from "../../../utils/number";
import { useWorkspace } from "../../../store/useWorkspace";
import CHAINS from "../../../utils/chain";
import styled from "@emotion/styled";

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
  hidden?: boolean;
};

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  console.log(searchTerm);
  const {
    workspace,
    totalAssetsValue,
    assetsList,
    getAssets,
    hideAssets,
    getHideAssets,
    assetsHideList,
    unHideAssets,
  } = useWorkspace();

  const chainData = CHAINS.find((c) => c.chainId === workspace?.chain_id);

  // useEffect(() => {
  //   workspace?.vault_wallet && getAssets();
  //   workspace?.vault_wallet && getHideAssets();
  // }, [workspace?.vault_wallet]);

  useEffect(() => {
    const fetchAssetsList = async () => {
      workspace?.vault_wallet && (await getAssets());
      workspace?.vault_wallet && (await getHideAssets());
    };
    fetchAssetsList();
  }, [workspace?.vault_wallet]);

  const filterList: AssetType[] =
    assetsList
      ?.map((item) => ({
        name: item.tokenInfo.name,
        symbol: item.tokenInfo.symbol,
        price: item.fiatConversion,
        priceIncrease: "0", // TODO not found data
        balance: item.balance,
        balanceDisplay: formatBalance(item.balance, item.tokenInfo.decimals),
        balanceUSD: Number(item.fiatBalance).format(),
        address: item.tokenInfo.address,
        hidden: item.hidden,
        link:
          item.tokenInfo.type === "NATIVE_TOKEN"
            ? ""
            : `${chainData?.explore}/token/${item.tokenInfo.address}`, // TODO check current safe chain
      }))
      .filter((data) =>
        data.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

  //switch style
  const AssetsSwitch = styled(Switch)(() => ({
    padding: 8,
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 16,
      height: 16,
      margin: 2,
    },
    "& .css-1yjjitx-MuiSwitch-track": {
      background: "white",
      border: "3px solid gray",
    },
    "& .css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track":
      {
        background: "#757575",
      },
    "& .css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase": {
      color: "gray",
    },
    "& .css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked": {
      color: "white",
    },
  }));

  // const [checked, setChecked] = useState(false);
  const handleAsset = async (event: any, data: AssetType) => {
    // setChecked(event.target.checked);
    if (data.hidden) {
      await unHideAssets(data.address);
      await getHideAssets();
      console.log("un hide");
    } else {
      await hideAssets(data.address);
      await getHideAssets();
      console.log("hide");
    }
  };

  console.log("assetsList", assetsList);

  return (
    <AssetSection>
      <AssetHeader>
        <TextField
          id="search"
          type="search"
          autoComplete="off"
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
      <AssetValue>Value: ${totalAssetsValue}</AssetValue>
      <AssetTable>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 500, minWidth: 700 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    // textAlign: "center",
                    background: "var(--bg-primary)",
                  }}
                >
                  Assets
                </TableCell>
                <TableCell
                  sx={{
                    // textAlign: "center",
                    background: "var(--bg-primary)",
                  }}
                >
                  Current price
                </TableCell>
                <TableCell
                  sx={{
                    // textAlign: "center",
                    background: "var(--bg-primary)",
                  }}
                >
                  Balance
                </TableCell>
                <TableCell
                  sx={{
                    // textAlign: "center",
                    background: "var(--bg-primary)",
                  }}
                >
                  Hide the asset
                </TableCell>
                <TableCell
                  sx={{
                    // textAlign: "center",
                    background: "var(--bg-primary)",
                  }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterList.map((data, i) => (
                <TableRow key={i}>
                  <TableCell
                    sx={{
                      textAlign: "left",
                    }}
                  >
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
                    <RowCell>
                      <AssetsSwitch
                        defaultChecked
                        checked={data.hidden}
                        onChange={(e) => handleAsset(e, data)}
                      />
                    </RowCell>
                  </TableCell>
                  <TableCell sx={{ paddingRight: "30px" }}>
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
  );
};

export default Assets;
