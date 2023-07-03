import { registerRootComponent } from "expo";
import RootNavigation from "navigation";
import { ThemeProvider } from "react-native-magnus";
import { Provider } from "react-redux";
import { store } from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </Provider>
  );
}

registerRootComponent(App);
