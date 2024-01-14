import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function WagmiProvider(props: React.PropsWithChildren) {
  const { chains, publicClient } = configureChains(
    [mainnet, polygon],
    [publicProvider()]
  );

  const config = createConfig({
    autoConnect: true,
    connectors: [
      new InjectedConnector({
        chains,
        options: {
          shimDisconnect: false,
        },
      }),
    ],
    publicClient,
  });

  return <WagmiConfig config={config}>{props.children}</WagmiConfig>;
}
