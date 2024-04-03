import { registerRootComponent } from "expo";
import RootNavigation from "navigation";
import { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import { ThemeProvider } from "react-native-magnus";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./store";

export default function App() {
  // change navigation bar color only on Android
  useEffect(() => {
    if (Platform.OS !== "android") return;
    changeNavigationBarColor("#FFFFFF");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
      </SafeAreaView>
    </View>
  );
}

registerRootComponent(App);
