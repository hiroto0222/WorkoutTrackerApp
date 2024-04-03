import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IExercise } from "api/types";
import AddExerciseScreen from "./AddExerciseScreen";
import WorkoutHomeScreen from "./WorkoutHomeScreen";
import WorkoutScreen from "./WorkoutScreen";

export type WorkoutStackParams = {
  WorkoutHome: undefined;
  Workout: undefined;
  AddExercise: { exercises: IExercise[] };
};

const WorkoutStack = createNativeStackNavigator<WorkoutStackParams>();

const WorkoutScreenStack = () => {
  return (
    <WorkoutStack.Navigator initialRouteName="WorkoutHome">
      <WorkoutStack.Screen
        name="WorkoutHome"
        component={WorkoutHomeScreen}
        options={{ headerShown: false }}
      />
      <WorkoutStack.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{
          headerTitle: "",
          animation: "slide_from_bottom",
        }}
      />
      <WorkoutStack.Screen
        name="AddExercise"
        component={AddExerciseScreen}
        options={{
          headerTitle: "",
          animation: "slide_from_right",
        }}
      />
    </WorkoutStack.Navigator>
  );
};

export default WorkoutScreenStack;
