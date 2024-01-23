declare interface QueueList {
  ID: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  workspace_id: number;
  payment_request_id: number;
  recipient: string;
  amount: string;
  currency_name: string;
  currency_contract_address: string;
  category_id: number;
  category_name: string;
  category_properties: string;
  safe_tx_hash: string;
  tx_hash: string;
  tx_timestamp: number;
  status: number;
  hide: boolean;
}
