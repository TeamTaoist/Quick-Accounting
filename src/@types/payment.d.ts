declare interface IPaymentRequest {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  workspace_id: number;
  payment_request_id: number;
  recipient: string;
  amount: string;
  currency_name: string;
  currency_contract_address: string;
  decimals: number;
  category_id: number;
  category_name: string;
  category_properties: string;
  safe_id: string;
  tx_hash: string;
  safe_tx_hash: string;
  tx_timestamp: number;
  status: number;
  hide: boolean;
  workspace_name: string;
  vault_wallet: string;
}

declare interface ICategoryProperties {
  name: string;
  type: string;
  values: string;
}
declare interface IRows {
  amount: string;
  currency_name: string;
  recipient: string;
  currency_contract_address?: string;
}
declare interface IPaymentRequestBody {
  category_id?: number;
  category_name?: string;
  category_properties?: ICategoryProperties[];
  rows: IRows[];
}

declare interface IPageResponse<T> {
  total: number;
  rows: T[];
}
