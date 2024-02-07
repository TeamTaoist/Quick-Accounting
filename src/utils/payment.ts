import multiSelect from "../assets/workspace/multi-select.svg";
import selectIcon from "../assets/workspace/select.svg";
import textIcon from "../assets/workspace/option.svg";

export enum PAYMENT_REQUEST_STATUS {
  Draft = 0,
  Submitted,
  Rejected,
  Pending,
  Failed,
  Executed,
}

export const getPaymentStatus = (status: PAYMENT_REQUEST_STATUS | number) => {
  switch (status) {
    case PAYMENT_REQUEST_STATUS.Draft:
      return "Draft";
    case PAYMENT_REQUEST_STATUS.Submitted:
      return "Submitted";
    case PAYMENT_REQUEST_STATUS.Rejected:
      return "Rejected";
    case PAYMENT_REQUEST_STATUS.Pending:
      return "Pending";
    case PAYMENT_REQUEST_STATUS.Failed:
      return "Failed";
    case PAYMENT_REQUEST_STATUS.Executed:
      return "Executed";
  }
};

export const getPropertyIconByType = (type: string) => {
  switch (type) {
    case "Text":
      return textIcon;
    case "single-select":
      return selectIcon;
    case "multi-select":
      return multiSelect;
  }
};
