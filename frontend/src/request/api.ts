import request from "./http";
import axios from "axios";

export const getTxs = () => {
  return request.get("/api/txes");
};

export const tagTx = () => {
  return request.put("/api/txes", {});
};

type TxListParamsType = {
  page: number;
  pageSize: number;
  tokenAddress: string;
  daoAddress: string;
};

export const getTxList = ({
  page,
  pageSize,
  tokenAddress,
  daoAddress,
}: TxListParamsType) => {
  return axios.get(
    `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${daoAddress}&page=${page}&offset=${
      pageSize * (page - 1)
    }&sort=desc&apikey=4VDU1V2ZEVKRNYSJIJU2B6RXHYNBSBTGMQ`
  );
};
