import axios from "axios";

const strapi_base = "http://localhost:1337";

export const getTxByHash = (hash: string) => {
  return axios.get(`${strapi_base}/api/txes?filters[hash][$eq]=${hash}`);
};

export const getTxByWallet= (daoAddress: string, tokenAddress: string) => {
  return axios.get(
    `${strapi_base}/api/txes?filters[wallet][$eq]=${daoAddress}&filters[tokenAddress][$eq]=${tokenAddress}`
  );
};

type TxTagParamsType = {
  wallet: string;
  blockNumber: number;
  hash: string;
  from: string;
  to: string;
  fromName?: string;
  toName?: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  tokenAddress: string;
  items: string;
  note: string;
  ipfs: string;
  category: string;
};

export const tagTx = (data: TxTagParamsType) => {
  return axios.post(
    `${strapi_base}/api/txes`,
    { data },
    { headers: { "Content-Type": "application/json" } }
  );
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

const JWT =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlYTg4MTdhMC1iOWI3LTRkZjAtYmNlNi1iMzhhMGI4NDhjNTQiLCJlbWFpbCI6Im1tbXBvbGFyODg4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3NThjNzA1YmM5Y2JkZjA5MmQ1NCIsInNjb3BlZEtleVNlY3JldCI6IjU3MTQ1YWM5Mzc4NmNkNmMzMmUwYjY2NzRkZjQzMjlhMmI1MDdjZjg5NTFmZWM2MTk3ZGE2ZWU5N2ViMjYwZjkiLCJpYXQiOjE2ODA4ODcwNjJ9.oK-aHC60joh1yYQoNYyt4Gjm0TIddEBch-0sCiz-SXk";

export const uploadJson = (jdata: any) => {
  return axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      pinataContent: jdata,
    },
    {
      headers: {
        Authorization: JWT,
      },
    }
  );
};
