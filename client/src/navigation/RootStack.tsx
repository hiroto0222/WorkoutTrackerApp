import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import HomeScreenStack, {
  HomeStackParams,
} from "components/screens/Home/HomeScreenStack";
import UserSettingScreen from "components/screens/UserSettings/UserSettingScreen";
import WorkoutScreenStack, {
  WorkoutStackParams,
} from "components/screens/Workout/WorkoutScreenStack";
import { Platform, TouchableOpacity } from "react-native";
import { Icon } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
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
    background: UIConstants.COLORS.PAGE,
  },
};

const BottomTabStack = createBottomTabNavigator<RootStackParams>();

const RootStack = () => {
  const workoutState = useSelector((state: RootState) => state.workout);

  const workoutBadge = {
    tabBarBadge: "+",
    tabBarBadgeStyle: {
      backgroundColor: UIConstants.COLORS.PRIMARY.REGULAR,
      fontSize: 15,
    },
  };

  const workoutOptions = {
    headerShown: false,
    tabBarLabel: "Workout",
    tabBarIcon: ({ color }: { color: string }) => (
      <TabBarIcon name="dumbbell" color={color} fontSize="5xl" />
    ),
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <BottomTabStack.Navigator
        initialRouteName={workoutState.isActive ? "WorkoutStack" : "HomeStack"}
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
            paddingHorizontal: 25,
            height: Platform.OS === "ios" ? 80 : 60,
            position: "absolute",
            backgroundColor: UIConstants.COLORS.PAGE,
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
          options={
            workoutState.isActive
              ? { ...workoutBadge, ...workoutOptions }
              : { ...workoutOptions }
          }
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
