import { useEffect, useState } from "react";
import {
  AssetHeader,
  AssetSection,
  AssetTable,
  AssetValue,
  EmptyAsset,
  EmptyAssetBtn,
  RowCell,
  RowLink,
} from "./assets.style";
import { InputAdornment, Switch, SwitchProps, TextField } from "@mui/material";
import searchIcon from "../../../assets/workspace/search-icon.svg";
import linkIcon from "../../../assets/workspace/link-icon.svg";
import rightArrow from "../../../assets/asset-right-arrow.svg";
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
import Pagination from "../../../components/Pagination";
import {
  Cell,
  HeaderCell,
  TableContainerSection,
} from "../../../components/table";

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
const TableHeaderStyles = {
  background: "var(--clr-gray-200)",
  fontSize: "14px",
  fontWeight: "500",
  width: "25%",
  padding: "14px 16px",
  fontFamily: "Inter",
  color: "#0F172A",
};
const TableCellsStyle = {
  padding: "12px 16px",
  borderBottom: "none",
  borderTop: "1px solid var(--clr-gray-200)",
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
    padding: 7,
    "& .MuiSwitch-track": {
      // borderRadius: 22 / 2,
      borderRadius: "20px",
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 20,
      height: 20,
      // margin: 2,
    },
    "& .css-1yjjitx-MuiSwitch-track": {
      background: "var(--clr-gray-300)",
      opacity: 1,
    },
    "& .css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track":
      {
        background: "#111",
        opacity: 1,
      },
    "& .css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase": {
      color: "white",
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
  // pagination
  const [pageNumbers, setPageNumbers] = useState(0);
  const pageSize = 10;
  const totalItem = assetsList.length;

  const pageCount = Math.ceil(totalItem / pageSize);

  const handlePageClick = (event: any) => {
    setPageNumbers(event.selected);
  };
  console.log("page", pageCount);
  return (
    <AssetSection>
      {!assetsList.length ? (
        <EmptyAsset>
          <h3>There are no assets in this wallet address yet.</h3>
          <p>All assets in that wallet address will be displayed here.</p>
          <EmptyAssetBtn>
            <h6>Check in Safe</h6>
            <span>
              <img src={rightArrow} alt="" />
            </span>
          </EmptyAssetBtn>
        </EmptyAsset>
      ) : (
        <>
          <AssetHeader>
            <TextField
              id="search"
              type="search"
              size="small"
              autoComplete="off"
              placeholder={t("assets.SearchPlaceholder")}
              value={searchTerm}
              onChange={handleChange}
              sx={{
                width: 350,
                "& fieldset.MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--clr-gray-300)",
                  borderRadius: "6px",
                },
                "& .MuiInputBase-input": {
                  height: "19px",
                  backgroundColor: "#fff",
                },
                "& .css-u104dj-MuiInputBase-root-MuiOutlinedInput-root": {
                  background: "#fff",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={searchIcon} alt="" />
                  </InputAdornment>
                ),
              }}
            />
          </AssetHeader>
          <AssetValue>
            <h3>${totalAssetsValue}</h3>
            <p>Total value</p>
          </AssetValue>
          <AssetTable>
            <TableContainerSection>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <HeaderCell width="208px">Assets</HeaderCell>
                    <HeaderCell width="288px">Current price</HeaderCell>
                    <HeaderCell width="288px">Balance</HeaderCell>
                    <HeaderCell width="170px">Hide the asset</HeaderCell>
                    <HeaderCell width="100px"></HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterList.map((data, i) => (
                    <TableRow key={i} sx={{}}>
                      <Cell>
                        {/* {recipientFormate(row.assetsName)} */}
                        <RowCell>
                          <h6>{data.symbol}</h6>
                          <p>{data.name}</p>
                        </RowCell>
                      </Cell>
                      <Cell>
                        <RowCell>
                          <h6>$ {data.price}</h6>
                          <p style={{ color: "#2F82CF" }}>
                            (+{data.priceIncrease}%)
                          </p>
                        </RowCell>
                      </Cell>
                      <Cell>
                        <RowCell>
                          <h6>
                            {data.balanceDisplay} {data.symbol}
                          </h6>
                          <p>${data.balanceUSD}</p>
                        </RowCell>
                      </Cell>
                      <Cell>
                        <RowCell>
                          {/* <AssetsSwitch
                            checked={data.hidden}
                            onChange={(e) => handleAsset(e, data)}
                          /> */}
                          <Switch
                            checked={data.hidden}
                            onChange={(e) => handleAsset(e, data)}
                            sx={{
                              padding: 1,
                              "& .MuiSwitch-track": {
                                borderRadius: "20px",
                              },
                              "& .MuiSwitch-thumb": {
                                boxShadow: "none",
                                width: 20,
                                height: 20,
                              },
                              "& .css-1yjjitx-MuiSwitch-track": {
                                background: "var(--clr-gray-300)",
                                opacity: 1,
                              },
                              "& .css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track":
                                {
                                  backgroundColor: "#0F172A",
                                  opacity: 1,
                                },
                              "& .css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase":
                                {
                                  color: "white",
                                },
                              "& .css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked":
                                {
                                  color: "white",
                                },
                            }}
                          />
                        </RowCell>
                      </Cell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          borderTop: "1px solid var(--clr-gray-200)",
                          display: "grid",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 0,
                          paddingInline: 2,
                          height: "56px",
                        }}
                      >
                        {data.link && (
                          <RowLink>
                            <a
                              href={data.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img src={linkIcon} alt="" />
                            </a>
                          </RowLink>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainerSection>
          </AssetTable>
        </>
      )}
      {totalItem >= 10 && (
        <Pagination
          handlePageClick={handlePageClick}
          pageCount={pageCount}
          pageNumbers={pageNumbers}
        />
      )}
    </AssetSection>
  );
};

export default Assets;
