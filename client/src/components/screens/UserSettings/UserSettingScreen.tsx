import SettingsItem from "components/base/usersettings/SettingsItem";
import UserMenu from "components/base/usersettings/UserMenu";
import globalStyles from "components/styles";
import { auth } from "config/firebase";
import { signOut } from "firebase/auth";
import useUpdateUser from "hooks/api/useUpdateUser";
import { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Div, Input, Text } from "react-native-magnus";
import { MenuProvider } from "react-native-popup-menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setAuth } from "store/slices/auth";
import UIConstants from "../../../constants";

const UserSettingScreen = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);

  const { validateUserSettings, updateUser } = useUpdateUser();

  const [name, setName] = useState(userState.user?.name || "");
  const [weight, setWeight] = useState(
    userState.user?.weight?.toString() || ""
  );
  const [height, setHeight] = useState(
    userState.user?.height?.toString() || ""
  );

  const handleLogout = () => {
    signOut(auth);
    dispatch(setAuth({}));
  };

  const handleSaveSettings = () => {
    if (validateUserSettings(name, weight, height)) {
      updateUser(name, weight, height);
    }
  };

  const isEdited =
    name !== userState.user?.name ||
    weight !== userState.user?.weight?.toString() ||
    height !== userState.user?.height?.toString();

  return (
    <MenuProvider>
      <View style={styles.container}>
        <Div px={25}>
          <Div row justifyContent="space-between" alignItems="center" mb={15}>
            <Text fontSize="6xl" style={globalStyles.textMedium}>
              Settings
            </Text>
            <Div row alignItems="center">
              {isEdited && (
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={() => handleSaveSettings()}
                >
                  <Text
                    color={UIConstants.COLORS.PRIMARY.CONTRAST}
                    style={globalStyles.textBold}
                    fontSize="xl"
                  >
                    SAVE
                  </Text>
                </TouchableOpacity>
              )}
              <UserMenu />
            </Div>
          </Div>
          <SettingsItem
            title="Name"
            icon="account"
            isEdited={name !== userState.user?.name}
            input={
              <Input
                value={name}
                onChangeText={(text) => setName(text)}
                autoCorrect={false}
                fontSize="lg"
                px="md"
                py="sm"
                borderWidth={0}
                style={{ width: "50%" }}
              />
            }
          />
          <SettingsItem
            title="Weight (kg)"
            icon="human-male"
            isEdited={weight !== userState.user?.weight?.toString()}
            input={
              <Input
                value={weight}
                onChangeText={(text) => setWeight(text)}
                fontSize="lg"
                keyboardType="numeric"
                px="md"
                py="sm"
                borderWidth={0}
                style={{ width: "50%" }}
              />
            }
          />
          <SettingsItem
            title="Height (cm)"
            icon="human-male-height"
            isEdited={height !== userState.user?.height?.toString()}
            input={
              <Input
                value={height}
                onChangeText={(text) => setHeight(text)}
                fontSize="lg"
                keyboardType="numeric"
                px="md"
                py="sm"
                borderWidth={0}
                style={{ width: "50%" }}
              />
            }
          />
        </Div>
      </View>
    </MenuProvider>
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
