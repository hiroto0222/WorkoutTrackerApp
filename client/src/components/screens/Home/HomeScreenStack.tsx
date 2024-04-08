import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IWorkoutsResponse } from "api/types";
import { ExerciseLogs } from "components/base/home/WorkoutDetailCard/WorkoutDetailCard";
import HomeScreen from "./HomeScreen";
import WorkoutDetailScreen from "./WorkoutDetailScreen";
import WorkoutsListScreen from "./WorkoutsListScreen";

export type HomeStackParams = {
  Home: undefined;
  WorkoutsList: undefined;
  WorkoutDetail: { exerciseLogs: ExerciseLogs; workout: IWorkoutsResponse };
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
      <HomeStack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{
          headerTitle: "",
          animation: "slide_from_right",
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeScreenStack;
