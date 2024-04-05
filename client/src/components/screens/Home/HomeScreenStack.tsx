import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import WorkoutsListScreen from "./WorkoutsListScreen";

export type HomeStackParams = {
  Home: undefined;
  WorkoutsList: undefined;
  WorkoutDetail: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParams>();

const HomeScreenStack = () => {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="WorkoutsList"
        component={WorkoutsListScreen}
        options={{
          headerTitle: "",
          animation: "slide_from_right",
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeScreenStack;
