declare interface IBookkeeping {
  amount: string;
  category_id: number;
  category_name: string;
  category_properties: string;
  createdAt: string;
  currency_contract_address: string;
  currency_name: string;
  deletedAt: string | null;
  hide: boolean;
  id: number;
  payment_request_id: number;
  recipient: string;
  safe_tx_hash: string;
  status: number;
  tx_hash: string;
  tx_timestamp: number;
  updatedAt: string;
  workspace_id: number;
}
