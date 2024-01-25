import type { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import { Interface, formatUnits, parseUnits } from "ethers";

const encodeERC20TransferData = (to: string, value: string): string => {
  const erc20Abi = ["function transfer(address to, uint256 value)"];
  const contractInterface = new Interface(erc20Abi);
  return contractInterface.encodeFunctionData("transfer", [to, value]);
};

export const createTokenTransferParams = (
  recipient: string,
  amount: string,
  decimals: number,
  tokenAddress: string
): MetaTransactionData => {
  const isNativeToken = parseInt(tokenAddress, 16) === 0;
  const value = parseUnits(amount, decimals)?.toString() || "0";

  return isNativeToken
    ? {
        to: recipient,
        value,
        data: "0x",
      }
    : {
        to: tokenAddress,
        value: "0",
        data: encodeERC20TransferData(recipient, value),
      };
};
