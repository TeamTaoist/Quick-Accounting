const SafePathPrefix = "https://app.safe.global/images/networks";
const CHAINS = [
  {
    chainId: 11155111,
    chainName: "Sepolia",
    logoPath: `${SafePathPrefix}/sep.png`,
    explore: "https://sepolia.etherscan.io",
  },
  {
    chainId: 1,
    chainName: "Ethereum",
    logoPath: `${SafePathPrefix}/mainnet.svg`,
    explore: "https://etherscan.io",
  },
  {
    chainId: 137,
    chainName: "Polygon",
    logoPath: `${SafePathPrefix}/polygon.svg`,
    explore: "https://polygonscan.com",
  },
];

export default CHAINS;
