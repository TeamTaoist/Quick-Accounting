import RouterLink from "./router";
import AppProvider from "./provider/appProvider";

function App() {
  return (
    <AppProvider>
      <RouterLink />
    </AppProvider>
  );
}

export default App;
