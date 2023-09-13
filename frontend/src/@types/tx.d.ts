declare interface ITransactionOrigin {
  hash: string;
  from: string;
  to: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
}

declare interface ITransaction {
  hash: string;
  from: string;
  to: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
  isOut: boolean;
  sender: string;
  receiver: string;
  to: string;
}
