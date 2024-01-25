declare interface SharePaymentRequestBody {
  amount: string;
  currency_name: string;
  recipient: string;
  category_id: null | number;
  category_name: string;
  currency_contract_address?: string;
  category_properties: [
    {
      name: string;
      type: string;
      values: string;
    }
  ];
}
