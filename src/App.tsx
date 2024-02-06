import RouterLink from "./router";
import WagmiProvider from "./providers/wagmiProvider";

const App = () => {
  return (
    <WagmiProvider>
        <RouterLink />
    </WagmiProvider>
  );
};

export default App;
