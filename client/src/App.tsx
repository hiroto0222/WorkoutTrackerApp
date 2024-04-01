import { registerRootComponent } from "expo";
import RootNavigation from "navigation";
import { StatusBar } from "react-native";
import { ThemeProvider } from "react-native-magnus";
import { Provider } from "react-redux";
import { store } from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigation />
        <StatusBar
          translucent
          backgroundColor="white"
          barStyle="dark-content"
        />
      </ThemeProvider>
    </Provider>
  );
}

registerRootComponent(App);
