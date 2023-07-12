import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "components/screens/HomeScreen";
import WorkoutScreen from "components/screens/WorkoutScreen";

export type UserStackParams = {
  Home: undefined;
  Workout: undefined;
};

const Stack = createNativeStackNavigator<UserStackParams>();

const UserStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;
