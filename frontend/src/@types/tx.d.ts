declare interface ITransactionOrigin {
  hash: string;
  from: string;
  to: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
  blockNumber: string;
  timeStamp: string;
}

declare interface ITransaction {
  hash: string;
  from: string;
  to: string;
  blockNumber: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
  isOut: boolean;
  dateDisplay: string;
}

declare interface ITransactionMore {
  hash: string;
  fromName: string;
  toName: string;
  note: string;
  items: string;
  category: string;
  ipfs: string;
}
