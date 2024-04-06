import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import HomeScreenStack, {
  HomeStackParams,
} from "components/screens/Home/HomeScreenStack";
import UserSettingScreen from "components/screens/UserSettings/UserSettingScreen";
import WorkoutScreenStack, {
  WorkoutStackParams,
} from "components/screens/Workout/WorkoutScreenStack";
import { TouchableOpacity } from "react-native";
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
          tabBarActiveTintColor: UIConstants.COLORS.GRAY.REGULAR,
          tabBarActiveBackgroundColor: UIConstants.COLORS.GRAY.LIGHT,
          tabBarButton: (props) => <TouchableOpacity {...props} />,
          tabBarItemStyle: {
            borderRadius: UIConstants.STYLES.BORDER_RADIUS,
          },
          tabBarStyle: {
            shadowColor: "#fff",
            paddingHorizontal: 30,
            height: 60,
            position: "absolute",
            backgroundColor: "#fff",
            paddingTop: 10,
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
  return <Icon fontFamily="MaterialCommunityIcons" {...props} />;
};

export default RootStack;
