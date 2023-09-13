import React, { useEffect, useState } from "react";
import Search from "./components/search";
import TagModal from "./components/tagModal";
import Table from "./components/table";
import { getTxList } from "../../request/api";

const PAGE_SIZE = 10;

interface ITransactionOrigin {
  hash: string;
  from: string;
  to: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [daoAddress, setDaoAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");

  const [showTable, setShowTable] = useState(false);

  const [originTxs, setOriginTxs] = useState<ITransactionOrigin[]>([]);

  const [page] = useState(1);

  const onChangeAddress = (key: string, value: string) => {
    if (key === "dao") {
      setDaoAddress(value);
    } else if (key === "token") {
      setTokenAddress(value);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCurrentTxList = async () => {
    try {
      const resp = await getTxList({
        page,
        pageSize: PAGE_SIZE,
        daoAddress,
        tokenAddress,
      });
      const { data } = resp;
      if (data.status === "1") {
        setOriginTxs(data.result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    console.log(daoAddress, tokenAddress);

    setShowTable(true);
    getCurrentTxList();
  };

  //   useEffect(() => {
  //     getCurrentTxList();
  //   }, [page]);

  return (
    <div>
      {showTable ? (
        <>
          <div>Dao: {daoAddress}</div>
          <div>Token: {tokenAddress}</div>
          <Table />
        </>
      ) : (
        <Search
          daoAddress={daoAddress}
          tokenAddress={tokenAddress}
          onChange={onChangeAddress}
          onSearch={handleSearch}
        />
      )}

      <TagModal open={open} handleClose={handleClose} />
    </div>
  );
}
