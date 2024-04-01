import { IExercise } from "api";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-magnus";
import ExerciseLogHeader from "./ExerciseLogHeader";
import ExerciseLogInputRow from "./ExerciseLogInputRow";

type Props = {
  exercise: IExercise;
};

const ExerciseLogInputTable = ({ exercise }: Props) => {
  return (
    <View>
      <Text style={{ marginBottom: 10 }} fontSize="2xl" color="orange600">
        {exercise.name}
      </Text>
      <ExerciseLogHeader logType={exercise.log_type} />
      <ExerciseLogInputRow exercise={exercise} />
    </View>
  );
};

export default ExerciseLogInputTable;

export const tableStyles = StyleSheet.create({
  tableHeader: {
    marginBottom: 5,
    flexDirection: "row",
  },
  columnOne: {
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
  },
  columnTwo: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  tableRow: {
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: "row",
  },
  columnOneInput: {
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
    padding: 5,
  },
  columnTwoInput: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    padding: 5,
  },
});
