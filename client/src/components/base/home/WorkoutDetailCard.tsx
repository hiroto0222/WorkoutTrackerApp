import { IWorkoutsResponse } from "api/types";
import globalStyles from "components/styles";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { getNameOfWeekday } from "utils";
import UIConstants from "../../../constants";

type Props = {
  workout: IWorkoutsResponse;
};

const WorkoutDetailCard = ({ workout }: Props) => {
  const workoutDate = new Date(workout.started_at);
  const workoutWeekdayName = getNameOfWeekday(workoutDate);

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
          {workoutDate.toDateString().substring(4)}
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
