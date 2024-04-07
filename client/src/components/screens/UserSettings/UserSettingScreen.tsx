import Button from "components/base/common/Button";
import globalStyles from "components/styles";
import { auth } from "config/firebase";
import { signOut } from "firebase/auth";
import { Platform, StyleSheet, View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { useDispatch } from "react-redux";
import { setAuth } from "store/slices/auth";
import UIConstants from "../../../constants";

const UserSettingScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(auth);
    dispatch(setAuth({}));
  };

  return (
    <View style={styles.container}>
      <Div px={25}>
        <Text fontSize="6xl" style={globalStyles.textMedium}>
          User Setting
        </Text>
        <Button
          buttonType="lg"
          onPress={() => handleLogout()}
          bg={UIConstants.COLORS.GRAY.LIGHT}
          color="#000"
          text="Logout"
          fontSize="xl"
        />
      </Div>
    </View>
  );
};

export default UserSettingScreen;

const styles = StyleSheet.create({
  container: {
    marginTop:
      Platform.OS === "android"
        ? UIConstants.SCREEN_MARGIN_TOP
        : UIConstants.SCREEN_MARGIN_TOP + 30,
  },
});
