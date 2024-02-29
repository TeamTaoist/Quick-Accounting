declare interface CategoryProperties {
  name: string | undefined;
  type: string | undefined;
  values: string | undefined;
}

declare interface SharePaymentRequestBody {
  amount: string;
  currency_name: string;
  recipient: string;
  counterparty?: string;
  decimals: number;
  category_id: null | number;
  category_name: string;
  currency_contract_address?: string;
  category_properties: CategoryProperties[];
}
interface IShareCategoryProperties {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  workspace_id: number;
  name: string;
  archived: boolean;
  properties: CategoryProperties[];
}

declare interface ISharePaymentList {
  category_and_properties: IShareCategoryProperties[];
  payment_request_items: IPaymentRequest[] | null;
  workspace: Workspace;
}
