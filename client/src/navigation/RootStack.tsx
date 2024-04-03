import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "components/screens/Home/HomeScreen";
import UserSettingScreen from "components/screens/UserSettings/UserSettingScreen";
import WorkoutScreenStack, {
  WorkoutStackParams,
} from "components/screens/Workout/WorkoutScreenStack";

export type RootStackParams = {
  Root: undefined;
  Home: undefined;
  WorkoutStack: WorkoutStackParams;
  UserSetting: undefined;
};

const BottomTabStack = createBottomTabNavigator<RootStackParams>();

const RootStack = () => {
  return (
    <NavigationContainer>
      <BottomTabStack.Navigator initialRouteName="Home">
        <BottomTabStack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <BottomTabStack.Screen
          name="WorkoutStack"
          component={WorkoutScreenStack}
          options={{ headerShown: false }}
        />
        <BottomTabStack.Screen
          name="UserSetting"
          component={UserSettingScreen}
          options={{ headerShown: false }}
        />
      </BottomTabStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
