import { IExerciseResponse, ILogResponse, IWorkoutsResponse } from "api/types";
import globalStyles from "components/styles";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { getNameOfWeekday } from "utils";
import UIConstants from "../../../constants";
import ExerciseLogsDetail from "./ExerciseLogsDetail";

type ExerciseLogs = {
  exercises: IExerciseResponse[];
  logs: { [exercise_id: number]: ILogResponse[] };
};

type Props = {
  workout: IWorkoutsResponse;
  logs: ILogResponse[];
};

const WorkoutDetailCard = ({ workout, logs }: Props) => {
  const exercises = useSelector((state: RootState) => state.exercises);

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
        const exercise = exercises;
        exerciseLogs.exercises.push(exercise.exercises[log.exercise_id]);
        exerciseLogs.logs[log.exercise_id] = [log];
      }
    });

    return exerciseLogs;
  };

  const exerciseLogs = createExerciseLogs();

  return (
    <TouchableOpacity style={styles.item}>
      <Div
        row
        justifyContent="space-between"
        style={{ width: "100%", marginBottom: 5 }}
      >
        <Text fontSize="xl" style={globalStyles.textMedium}>
          {workoutWeekdayName} Workout
        </Text>
        <Text fontSize="md" style={globalStyles.textRegular}>
          {workoutDate.toDateString().substring(4)}{" "}
          {workoutDate.toTimeString().substring(0, 5)}
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
    borderRadius: 20,
    marginVertical: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: "flex-start",
  },
});
