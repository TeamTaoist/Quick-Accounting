const SafePathPrefix = "https://app.safe.global/images/networks";
const CHAINS = [
  {
    chainId: 1,
    chainName: "Ethereum",
    logoPath: `${SafePathPrefix}/mainnet.svg`,
  },
  {
    chainId: 137,
    chainName: "Polygon",
    logoPath: `${SafePathPrefix}/polygon.svg`,
  },
];

export default CHAINS;
