import axios from "axios";

const strapi_base = "http://localhost:1337";

export const getTxByHash = (hash: string) => {
  return axios.get(`${strapi_base}/api/txes?filters[hash][$eq]=${hash}`);
};

export const tagTx = () => {
  return axios.put(`${strapi_base}/api/txes`, {});
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
