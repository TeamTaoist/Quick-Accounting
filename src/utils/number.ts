import { formatUnits } from "viem";

export const formatNumber = (num: number) => {
  if (num >= 0) {
    return num < 1 ? num : num.toLocaleString("en-US");
  } else {
    return "-" + Math.abs(num).toLocaleString("en-US");
  }
};

export const getShortDisplay = (v: any, num = 2) => {
  if (!v) return v;
  let value: string;
  if (typeof v === "number") {
    value = String(v);
  } else {
    value = v;
  }
  const arr = value.split(".");
  let res = arr[0];
  if (arr[1]) {
    const more = `.${arr[1].slice(0, num || 6)}`;
    res += more;
    if (more.length < num + 1) {
      res += "0".repeat(num + 1 - more.length);
    }
  } else {
    res += ".00";
  }
  return res;
};

Number.prototype.format = function (n = 2) {
  return getShortDisplay(formatNumber(Number(this)), n);
};

export const formatBalance = (balance: string, decimals: number) => {
  return Number(formatUnits(BigInt(balance), decimals)).format();
};
