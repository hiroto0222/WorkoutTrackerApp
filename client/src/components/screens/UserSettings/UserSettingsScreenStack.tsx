import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserSettingScreen from "./UserSettingScreen";

export type UserSettingsStackParams = {
  UserSettings: undefined;
};

const UserSettingsStack = createNativeStackNavigator<UserSettingsStackParams>();

const UserSettingsScreenStack = () => {
  return (
    <UserSettingsStack.Navigator initialRouteName={"UserSettings"}>
      <UserSettingsStack.Screen
        name="UserSettings"
        component={UserSettingScreen}
        options={{ headerShown: false }}
      />
    </UserSettingsStack.Navigator>
  );
};

export default UserSettingsScreenStack;
