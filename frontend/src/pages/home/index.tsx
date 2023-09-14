import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

import Search from "./components/search";
import Table from "./components/table";
import { getTxByHash, getTxList } from "../../request/api";
import { ethers } from "ethers";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import { formatTime, getUTC } from "../../utils/time";

import { BASIC_TOKENS } from "../../utils/constants";

const PAGE_SIZE = 20;

export default function Home() {
  const [daoAddress, setDaoAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");

  const [showTable, setShowTable] = useState(false);

  const [originTxs, setOriginTxs] = useState<ITransaction[]>([]);
  const [txMap, setTxMap] = useState<{ [tx: string]: ITransactionMore }>({});

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const onChangeAddress = (key: string, value: string) => {
    if (key === "dao") {
      setDaoAddress(value);
    } else if (key === "token") {
      setTokenAddress(value);
    }
  };

  const getTxMore = async (hashes: string[]) => {
    if (!hashes.length) {
      setTxMap({});
      return;
    }
    try {
      const result = await Promise.all(hashes.map((hash) => getTxByHash(hash)));
      const _tx_map: { [tx: string]: ITransactionMore } = {};
      result.forEach((resp, i) => {
        const data = resp.data.data;
        if (data[0]) {
          _tx_map[hashes[i]] = data[0].attributes;
        }
      });
      setTxMap(_tx_map);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTxMore(originTxs.map((d) => d.hash));
  }, [originTxs]);

  const getCurrentTxList = async (init?: boolean) => {
    try {
        const resp = await getTxList({
          page: init ? 1 : page,
          pageSize: PAGE_SIZE,
          daoAddress,
          // tokenAddress,
          tokenAddress: BASIC_TOKENS[0],
        });
        const { data } = resp;
      // const data = {
      //   status: "1",
      //   message: "OK-Missing/Invalid API Key, rate limit of 1/5sec applied",
      //   result: [
      //     {
      //       blockNumber: "4730207",
      //       timeStamp: "1513240363",
      //       hash: "0xe8c208398bd5ae8e4c237658580db56a2a94dfa0ca382c99b776fa6e7d31d5b4",
      //       nonce: "406",
      //       blockHash:
      //         "0x022c5e6a3d2487a8ccf8946a2ffb74938bf8e5c8a3f6d91b41c56378a96b5c37",
      //       from: "0x642ae78fafbb8032da552d619ad43f1d81e4dd7c",
      //       contractAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      //       to: "0x4e83362442b8d1bec281594cea3050c8eb01311c",
      //       value: "5901522149285533025181",
      //       tokenName: "Maker",
      //       tokenSymbol: "MKR",
      //       tokenDecimal: "18",
      //       transactionIndex: "81",
      //       gas: "940000",
      //       gasPrice: "32010000000",
      //       gasUsed: "77759",
      //       cumulativeGasUsed: "2523379",
      //       input: "deprecated",
      //       confirmations: "13396133",
      //     },
      //     {
      //       blockNumber: "4764973",
      //       timeStamp: "1513764636",
      //       hash: "0x9c82e89b7f6a4405d11c361adb6d808d27bcd9db3b04b3fb3bc05d182bbc5d6f",
      //       nonce: "428",
      //       blockHash:
      //         "0x87a4d04a6d8fce7a149e9dc528b88dc0c781a87456910c42984bdc15930a2cac",
      //       from: "0x4e83362442b8d1bec281594cea3050c8eb01311c",
      //       contractAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      //       to: "0x69076e44a9c70a67d5b79d95795aba299083c275",
      //       value: "132520488141080",
      //       tokenName: "Maker",
      //       tokenSymbol: "MKR",
      //       tokenDecimal: "18",
      //       transactionIndex: "167",
      //       gas: "940000",
      //       gasPrice: "35828000000",
      //       gasUsed: "127593",
      //       cumulativeGasUsed: "6315818",
      //       input: "deprecated",
      //       confirmations: "13361367",
      //     },
      //     {
      //       blockNumber: "4776460",
      //       timeStamp: "1513941310",
      //       hash: "0xb042fda6860e8fbf85d231fc2592c0a05102fef0b3abb598a48815bb7bda5d8c",
      //       nonce: "489",
      //       blockHash:
      //         "0x830bc2f54eb058b46e18fd8e4f6e002e29172f4054ef7bc73f48f600658f7de7",
      //       from: "0x4e83362442b8d1bec281594cea3050c8eb01311c",
      //       contractAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      //       to: "0x69076e44a9c70a67d5b79d95795aba299083c275",
      //       value: "14319250673330303",
      //       tokenName: "Maker",
      //       tokenSymbol: "MKR",
      //       tokenDecimal: "18",
      //       transactionIndex: "54",
      //       gas: "940000",
      //       gasPrice: "40000000000",
      //       gasUsed: "129551",
      //       cumulativeGasUsed: "1856920",
      //       input: "deprecated",
      //       confirmations: "13349880",
      //     },
      //     {
      //       blockNumber: "4917971",
      //       timeStamp: "1516105109",
      //       hash: "0x25336233856ab4f064ea1282088dccd040c2d8e60469ab82527f0ecc53ea3b0f",
      //       nonce: "543",
      //       blockHash:
      //         "0xf5f41f70e6a5da6d85de3fadfa2c4d860612470d588a48347f4a18b22341787a",
      //       from: "0x4e83362442b8d1bec281594cea3050c8eb01311c",
      //       contractAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      //       to: "0xdea6865acca43786df85ea15fb73593c609d0de3",
      //       value: "600000000000000000",
      //       tokenName: "Maker",
      //       tokenSymbol: "MKR",
      //       tokenDecimal: "18",
      //       transactionIndex: "151",
      //       gas: "661286",
      //       gasPrice: "52000000000",
      //       gasUsed: "80643",
      //       cumulativeGasUsed: "4718011",
      //       input: "deprecated",
      //       confirmations: "13208369",
      //     },
      //     {
      //       blockNumber: "4917977",
      //       timeStamp: "1516105220",
      //       hash: "0x000ce0ef17ceec7c10f67d0bb9cd3993083e2e17207ecc95ad1a08cb64b90f7e",
      //       nonce: "544",
      //       blockHash:
      //         "0x2523284f21ebba1621ebe04a8b2cd18f3b6afa2633e359a4f2fad87ab387d3c2",
      //       from: "0x4e83362442b8d1bec281594cea3050c8eb01311c",
      //       contractAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      //       to: "0xef42cf85be6adf3081ada73af87e27996046fe63",
      //       value: "819400000000000000",
      //       tokenName: "Maker",
      //       tokenSymbol: "MKR",
      //       tokenDecimal: "18",
      //       transactionIndex: "289",
      //       gas: "661350",
      //       gasPrice: "52000000000",
      //       gasUsed: "80675",
      //       cumulativeGasUsed: "6722089",
      //       input: "deprecated",
      //       confirmations: "13208363",
      //     },
      //     {
      //       blockNumber: "4928274",
      //       timeStamp: "1516266159",
      //       hash: "0x0b70357b47b358f23db844c858d80eb5e383c362599cf858521025b58cd069fa",
      //       nonce: "555",
      //       blockHash:
      //         "0xe5811045bfbfb9c54866ba8dbc908fd4f2a60b6647b53f3943e27db774ae7db1",
      //       from: "0x14fbca95be7e99c15cc2996c6c9d841e54b79425",
      //       contractAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      //       to: "0x4e83362442b8d1bec281594cea3050c8eb01311c",
      //       value: "466791047660603577086",
      //       tokenName: "Maker",
      //       tokenSymbol: "MKR",
      //       tokenDecimal: "18",
      //       transactionIndex: "226",
      //       gas: "660886",
      //       gasPrice: "50000000000",
      //       gasUsed: "80443",
      //       cumulativeGasUsed: "6189589",
      //       input: "deprecated",
      //       confirmations: "13198066",
      //     },
      //     {
      //       blockNumber: "4929307",
      //       timeStamp: "1516281621",
      //       hash: "0x86d1f4c8727d4161f8e1776e3e88748f42fb42108401686249d784e5c7064909",
      //       nonce: "561",
      //       blockHash:
      //         "0x8e6a4f4bb90969501a072c309a8c2e594d92751099a79f69f48ed3a4bb981749",
      //       from: "0x14fbca95be7e99c15cc2996c6c9d841e54b79425",
      //       contractAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      //       to: "0x4e83362442b8d1bec281594cea3050c8eb01311c",
      //       value: "269786867391304347826",
      //       tokenName: "Maker",
      //       tokenSymbol: "MKR",
      //       tokenDecimal: "18",
      //       transactionIndex: "216",
      //       gas: "660886",
      //       gasPrice: "50000000000",
      //       gasUsed: "80443",
      //       cumulativeGasUsed: "5804793",
      //       input: "deprecated",
      //       confirmations: "13197033",
      //     },
      //   ],
      // };

      const checkEqual = (a1:string, a2:string) => {
        return a1.toLowerCase() === a2.toLowerCase();
      }
      if (data.status === "1") {
        setOriginTxs(
          data.result.map((d: any) => ({
            hash: d.hash,
            from: d.from,
            to: d.to,
            blockNumber: d.blockNumber,
            tokenName: d.tokenName,
            tokenDecimal: d.tokenDecimal,
            tokenSymbol: d.tokenSymbol,
            isOut: checkEqual(d.from, daoAddress),
            value: ethers.utils.formatUnits(
              ethers.BigNumber.from(d.value),
              Number(d.tokenDecimal)
            ),
            sender: checkEqual(d.from, daoAddress) ? "" : d.from,
            receiver: checkEqual(d.from, daoAddress) ? d.to : "",
            dateDisplay: formatTime(Number(d.timeStamp) * 1000, "-"),
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    console.log(daoAddress, tokenAddress);

    getCurrentTxList(true); // fetch tx list

    setShowTable(true);
  };

  useEffect(() => {
    page > 1 && getCurrentTxList();
  }, [page]);

  const onChangePage = (_: any, p: number) => {
    setPage(p);
  };

  const onHandleSearch = () => {
    setPage(1);
    getCurrentTxList(true);
  };

  const updateTx = (hash: string, tx: ITransactionMore) => {
    setTxMap({...txMap, [hash]: tx})
  };

  return (
    <HomeStyle>
      {showTable ? (
        <>
          <BasicDataBox>
            <FormControl
              style={{ width: "50%" }}
              sx={{ m: 1 }}
              variant="filled"
            >
              <FilledInput
                id="filled-adornment-amount"
                value={daoAddress}
                readOnly
                startAdornment={
                  <InputAdornment position="start">Treasury</InputAdornment>
                }
              />
            </FormControl>
            {/* <div style={{ display: "flex", alignItems: "center" }}>
              <FormControl
                style={{ width: "50%" }}
                sx={{ m: 1 }}
                variant="filled"
              >
                <FilledInput
                  value={tokenAddress}
                  autoFocus
                  onChange={(e) => onChangeAddress("token", e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">Token</InputAdornment>
                  }
                />
              </FormControl>
              <Button variant="contained" onClick={onHandleSearch}>
                Search
              </Button>
            </div> */}
          </BasicDataBox>
          <Table
            data={originTxs}
            daoAddress={daoAddress}
            tokenAddress={tokenAddress}
            txMap={txMap}
            updateTx={updateTx}
          >
            <PageLine>
              <PaginationBox
                color="primary"
                shape="rounded"
                page={page}
                onChange={onChangePage}
              />
            </PageLine>
          </Table>
        </>
      ) : (
        <Search
          daoAddress={daoAddress}
          onChange={onChangeAddress}
          onSearch={handleSearch}
        />
      )}
    </HomeStyle>
  );
}

const HomeStyle = styled.div`
  height: calc(100vh - 80px);
  padding-top: 30px;
`;

const PageLine = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PaginationBox = styled(Pagination)`
  margin: 30px 0 0;
`;
const BasicDataBox = styled.div`
  background-color: #fff;
  padding: 10px 20px;
  margin: 0 20px 20px;
  border-radius: 6px;
`;
