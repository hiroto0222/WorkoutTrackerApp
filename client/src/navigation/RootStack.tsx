import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import HomeScreenStack, {
  HomeStackParams,
} from "components/screens/Home/HomeScreenStack";
import UserSettingScreen from "components/screens/UserSettings/UserSettingScreen";
import WorkoutScreenStack, {
  WorkoutStackParams,
} from "components/screens/Workout/WorkoutScreenStack";
import { Icon } from "react-native-magnus";
import UIConstants from "../constants";

export type RootStackParams = {
  Root: undefined;
  HomeStack: HomeStackParams;
  WorkoutStack: WorkoutStackParams;
  UserSetting: undefined;
};

export const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
  },
};

const BottomTabStack = createBottomTabNavigator<RootStackParams>();

const RootStack = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <BottomTabStack.Navigator
        initialRouteName="HomeStack"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: UIConstants.COLORS.PRIMARY.REGULAR,
          tabBarStyle: {
            shadowColor: "#fff",
            height: 60,
            position: "absolute",
            paddingHorizontal: 20,
            backgroundColor: "#fff",
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        <BottomTabStack.Screen
          name="HomeStack"
          component={HomeScreenStack}
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="home" color={color} fontSize="5xl" />
            ),
          }}
        />
        <BottomTabStack.Screen
          name="WorkoutStack"
          component={WorkoutScreenStack}
          options={{
            headerShown: false,
            tabBarLabel: "Workout",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="dumbbell" color={color} fontSize="5xl" />
            ),
          }}
        />
        <BottomTabStack.Screen
          name="UserSetting"
          component={UserSettingScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Settings",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="cog" color={color} fontSize="5xl" />
            ),
          }}
        />
      </BottomTabStack.Navigator>
    </NavigationContainer>
  );
};

const TabBarIcon = (props: {
  name: string;
  color: string;
  fontSize: string;
}) => {
  return (
    <Icon
      fontFamily="MaterialCommunityIcons"
      style={{ marginBottom: -5 }}
      {...props}
    />
  );
};

export default RootStack;
