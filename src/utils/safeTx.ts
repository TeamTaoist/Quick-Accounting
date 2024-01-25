import type {
  MetaTransactionData,
  SafeMultisigTransactionResponse,
} from "@safe-global/safe-core-sdk-types";
import { Interface, formatUnits, parseUnits } from "ethers";

const encodeERC20TransferData = (to: string, value: string): string => {
  const erc20Abi = ["function transfer(address to, uint256 value)"];
  const contractInterface = new Interface(erc20Abi);
  return contractInterface.encodeFunctionData("transfer", [to, value]);
};

export const createTokenTransferParams01 = (
  recipient: string,
  amount: string,
  tokenAddress: string
): MetaTransactionData => {
  const isNativeToken = parseInt(tokenAddress, 16) === 0;
  return isNativeToken
    ? {
        to: recipient,
        value: amount,
        data: "0x",
      }
    : {
        to: tokenAddress,
        value: "0",
        data: encodeERC20TransferData(recipient, amount),
      };
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

// Check if a Safe transaction is already signed by an owner:
export const isTransactionSignedByAddress = (
  signerAddress: string,
  transaction: SafeMultisigTransactionResponse
) => {
  const confirmation = transaction.confirmations?.find(
    (confirmation) => confirmation.owner === signerAddress
  );
  return !!confirmation;
};

// Check if a Safe transaction is ready to be executed:
export const isTransactionExecutable = (
  safeThreshold: number,
  transaction: SafeMultisigTransactionResponse
) => {
  return transaction.confirmations?.length || 0 >= safeThreshold;
};
