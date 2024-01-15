import { getAddress } from "viem";

export const getShortAddress = (address: string, num?: number) => {
  const n = num || 4;
  if (address.length < n) {
    return address;
  }
  const _address = getAddress(address);

  const frontStr = _address.substring(0, n + 2);
  const afterStr = _address.substring(address.length - n, address.length);

  return `${frontStr}...${afterStr}`;
};
