const SafePathPrefix = "https://app.safe.global/images/networks";
const CHAINS = [
  {
    chainId: 11155111,
    chainName: "Sepolia",
    logoPath: `${SafePathPrefix}/sep.png`,
    explore: "https://sepolia.etherscan.io",
    short: "sep",
    nativeToken: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    chainId: 1,
    chainName: "Ethereum",
    logoPath: `${SafePathPrefix}/mainnet.svg`,
    explore: "https://etherscan.io",
    short: "eth",
  },
  {
    chainId: 137,
    chainName: "Polygon",
    logoPath: `${SafePathPrefix}/polygon.svg`,
    explore: "https://polygonscan.com",
    short: "matic",
  },
];

export default CHAINS;

export const getChainExplorer = (chainId: number) => {
  const chainData = CHAINS.find((chain) => chain.chainId === chainId);
  return chainData?.explore;
};

export const getChainLogo = (chainId: number) => {
  const chainData = CHAINS.find((chain) => chain.chainId === chainId);
  return chainData?.logoPath;
};
