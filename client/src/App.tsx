import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
  useFonts,
} from "@expo-google-fonts/poppins";
import Loading from "components/base/common/Loading";
import { registerRootComponent } from "expo";
import * as SplashScreen from "expo-splash-screen";
import RootNavigation from "navigation";
import { useCallback, useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import FlashMessage from "react-native-flash-message";
import { ThemeProvider } from "react-native-magnus";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import UIConstants from "./constants";
import { persistor, store } from "./store";

SplashScreen.preventAutoHideAsync();

export default function App() {
  // change navigation bar color only on Android
  useEffect(() => {
    if (Platform.OS !== "android") return;
    changeNavigationBarColor("#FFFFFF");
  }, []);

  // load fonts
  let [fontsLoaded, fontsError] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontsError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <Provider store={store}>
          <PersistGate loading={<Loading />} persistor={persistor}>
            <ThemeProvider>
              <RootNavigation />
              <StatusBar
                translucent
                backgroundColor="white"
                barStyle="dark-content"
              />
              <FlashMessage
                position="top"
                statusBarHeight={UIConstants.SCREEN_MARGIN_TOP + 10}
                duration={3000}
                floating
              />
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </SafeAreaView>
    </View>
  );
}

registerRootComponent(App);
