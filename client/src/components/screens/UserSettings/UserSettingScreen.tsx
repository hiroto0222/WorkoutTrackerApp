import { auth } from "config/firebase";
import { signOut } from "firebase/auth";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-magnus";
import { useDispatch } from "react-redux";
import { setAuth } from "store/slices/auth";
import Constants from "../../../constants";

const UserSettingScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(auth);
    dispatch(setAuth({}));
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default UserSettingScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.SCREEN_MARGIN_TOP,
  },
});
