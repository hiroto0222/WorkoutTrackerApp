import { auth } from "config/firebase";
import Constants from "expo-constants";
import { signOut } from "firebase/auth";
import { SafeAreaView } from "react-native";
import { Button, Text } from "react-native-magnus";
import { useDispatch } from "react-redux";
import { setAuth } from "store/slices/auth";

const UserSettingScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(auth);
    dispatch(setAuth({}));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, marginTop: Constants.statusBarHeight + 30 }}
    >
      <Text mt="sm" mx="xl" w="70%" fontWeight="bold" fontSize="5xl">
        User Setting
      </Text>
      <Button
        onPress={() => handleLogout()}
        mx="xl"
        mt="sm"
        mb="xl"
        py="lg"
        bg="gray300"
        rounded="circle"
        block
        color="black"
      >
        Sign Out
      </Button>
    </SafeAreaView>
  );
};

export default UserSettingScreen;
