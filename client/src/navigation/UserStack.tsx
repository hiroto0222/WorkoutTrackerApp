import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddExerciseScreen from "components/screens/AddExerciseScreen";
import HomeScreen from "components/screens/HomeScreen";
import UserSettingScreen from "components/screens/UserSettingScreen";
import WorkoutScreen from "components/screens/WorkoutScreen";
import BottomTabNavigator from "./BottomTabNavigator";

export type UserStackParams = {
  Root: undefined;
  Home: undefined;
  Workout: undefined;
  UserSetting: undefined;
  AddExercise: undefined;
};

const Stack = createNativeStackNavigator<UserStackParams>();

const UserStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: "slide_from_bottom" }}>
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Workout"
          component={WorkoutScreen}
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="AddExercise"
          component={AddExerciseScreen}
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="UserSetting"
          component={UserSettingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;
