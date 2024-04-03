import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "components/screens/Home/HomeScreen";
import UserSettingScreen from "components/screens/UserSettings/UserSettingScreen";
import WorkoutScreenStack, {
  WorkoutStackParams,
} from "components/screens/Workout/WorkoutScreenStack";
import { Icon } from "react-native-magnus";

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
      <BottomTabStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#ed8936",
          tabBarStyle: {
            height: 60,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            position: "absolute",
            paddingHorizontal: 20,
            backgroundColor: "#fff",
          },
        }}
      >
        <BottomTabStack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
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
