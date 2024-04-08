import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IExerciseResponse, ILogResponse, IWorkoutsResponse } from "api/types";
import { HomeStackParams } from "components/screens/Home/HomeScreenStack";
import globalStyles from "components/styles";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { formatTimeAMPM, getNameOfWeekday } from "utils";
import UIConstants from "../../../constants";
import ExerciseLogsDetail from "./ExerciseLogsDetail";

export type ExerciseLogs = {
  exercises: IExerciseResponse[];
  logs: { [exercise_id: number]: ILogResponse[] };
};

type Props = {
  workout: IWorkoutsResponse;
  logs: ILogResponse[];
};

const WorkoutDetailCard = ({ workout, logs }: Props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();

  const exercisesState = useSelector((state: RootState) => state.exercises);

  const workoutDate = new Date(workout.started_at);
  const workoutWeekdayName = getNameOfWeekday(workoutDate);

  const createExerciseLogs = () => {
    const exerciseLogs: ExerciseLogs = {
      exercises: [],
      logs: {},
    };
    logs.forEach((log) => {
      if (log.exercise_id in exerciseLogs.logs) {
        exerciseLogs.logs[log.exercise_id].push(log);
      } else {
        exerciseLogs.exercises.push(exercisesState.exercises[log.exercise_id]);
        exerciseLogs.logs[log.exercise_id] = [log];
      }
    });

    return exerciseLogs;
  };

  const exerciseLogs = createExerciseLogs();

  const handleOnPress = () => {
    navigation.navigate("WorkoutDetail", { exerciseLogs, workout });
  };

  return (
    <TouchableOpacity onPress={handleOnPress} style={styles.item}>
      <Div
        row
        justifyContent="space-between"
        style={{ width: "100%", marginBottom: 5 }}
      >
        <Text fontSize="xl" style={globalStyles.textMedium}>
          {workoutWeekdayName} Workout
        </Text>
        <Text fontSize="md" style={globalStyles.textRegular}>
          {workoutDate.toDateString().substring(4)}
          {", "}
          {formatTimeAMPM(workoutDate)}
        </Text>
      </Div>
      <Div row justifyContent="space-between" style={{ width: "100%" }}>
        <Text fontSize="lg" style={globalStyles.textMedium}>
          Exercises
        </Text>
        <Text fontSize="lg" style={globalStyles.textMedium}>
          Best Set
        </Text>
      </Div>
      {exerciseLogs.exercises.map((exercise) => {
        return (
          <ExerciseLogsDetail
            key={exercise.id}
            exercise={exercise}
            logs={exerciseLogs.logs[exercise.id]}
          />
        );
      })}
    </TouchableOpacity>
  );
};

export default WorkoutDetailCard;

const styles = StyleSheet.create({
  item: {
    backgroundColor: UIConstants.COLORS.GRAY.LIGHT,
    padding: 20,
    borderRadius: UIConstants.STYLES.BORDER_RADIUS,
    marginVertical: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: "flex-start",
  },
});
