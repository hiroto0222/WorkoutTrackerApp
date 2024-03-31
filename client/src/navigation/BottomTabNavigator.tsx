import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "components/screens/HomeScreen";
import UserSettingScreen from "components/screens/UserSettingScreen";
import { Icon } from "react-native-magnus";

export type BottomTabParamList = {
  Home: undefined;
  UserSetting: undefined;
};

export type TabHomeParamList = {
  HomeScreen: undefined;
};

export type TabUserSettingParamList = {
  UserSettingScreen: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#D84343",
        tabBarStyle: {
          marginLeft: 30,
          marginRight: 30,
          marginBottom: 30,
          borderRadius: 35,
          paddingBottom: 10,
          borderTopWidth: 0,
          position: "absolute",
          paddingHorizontal: 20,
          backgroundColor: "#fff",
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={TabHomeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="UserSetting"
        component={TabUserSettingNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="setting" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;

const TabBarIcon = (props: { name: string; color: string }) => {
  return (
    <Icon
      fontFamily="AntDesign"
      fontSize="4xl"
      style={{ marginBottom: -5 }}
      {...props}
    />
  );
};

const TabHomeStack = createNativeStackNavigator<TabHomeParamList>();

const TabHomeNavigator = () => {
  return (
    <TabHomeStack.Navigator>
      <TabHomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </TabHomeStack.Navigator>
  );
};

const TabUserSettingStack =
  createNativeStackNavigator<TabUserSettingParamList>();

const TabUserSettingNavigator = () => {
  return (
    <TabUserSettingStack.Navigator>
      <TabUserSettingStack.Screen
        name="UserSettingScreen"
        component={UserSettingScreen}
        options={{
          headerShown: false,
        }}
      />
    </TabUserSettingStack.Navigator>
  );
};
