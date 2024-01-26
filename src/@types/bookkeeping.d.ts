declare interface IBookkeeping {
  amount: string;
  category_id: number;
  category_name: string;
  category_properties: string;
  CreatedAt: string;
  currency_contract_address: string;
  currency_name: string;
  DeletedAt: string | null;
  hide: boolean;
  ID: number;
  payment_request_id: number;
  recipient: string;
  safe_tx_hash: string;
  status: number;
  tx_hash: string;
  tx_timestamp: number;
  UpdatedAt: string;
  workspace_id: number;
}
