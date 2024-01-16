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

export const createSiweMessage = (
  address: string,
  chainId: number,
  nonce: string,
  statement: string
) => {
  const message = {
    domain: window.location.origin,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: chainId,
    nonce,
  };
  const header = `${message.domain} wants you to sign in with your Ethereum account:`;
  const uriField = `URI: ${message.uri}`;
  let prefix = [header, message.address].join("\n");
  const versionField = `Version: ${message.version}`;

  const chainField = `Chain ID: ` + message.chainId || "1";

  let nonceField;

  if (message.nonce) {
    nonceField = `Nonce: ${message.nonce}`;
  }

  const issuedAt = new Date().toISOString();

  const suffixArray = [uriField, versionField, chainField, nonceField];

  suffixArray.push(`Issued At: ${issuedAt}`);

  const suffix = suffixArray.join("\n");
  prefix = [prefix, message.statement].join("\n\n");
  if (message.statement) {
    prefix += "\n";
  }
  return [prefix, suffix].join("\n");
};
