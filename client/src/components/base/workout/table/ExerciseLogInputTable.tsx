import { IExercise } from "api";
import { StyleSheet, View } from "react-native";
import { Button, Div, Icon, Text } from "react-native-magnus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { addEmptyLog } from "store/slices/workout";
import ExerciseLogHeader from "./ExerciseLogHeader";
import ExerciseLogInputRow from "./ExerciseLogInputRow";

type Props = {
  exercise: IExercise;
};

const ExerciseLogInputTable = ({ exercise }: Props) => {
  const dispatch = useDispatch();
  const workoutState = useSelector((state: RootState) => state.workout);

  const handleAddEmptySet = () => {
    dispatch(addEmptyLog(exercise));
  };

  return (
    <View>
      <Text style={{ marginBottom: 10 }} fontSize="2xl" color="orange600">
        {exercise.name}
      </Text>
      <ExerciseLogHeader logType={exercise.log_type} />
      {workoutState.currLogs[exercise.id].map((_, setNumber) => (
        <ExerciseLogInputRow
          key={setNumber}
          exercise={exercise}
          setNumber={setNumber}
        />
      ))}
      <Div mt="md" alignItems="center" justifyContent="center">
        <Button
          mx="3xl"
          mb="lg"
          bg="orange100"
          rounded="circle"
          onPress={handleAddEmptySet}
          block
        >
          <Icon
            fontSize="xl"
            fontFamily="AntDesign"
            name="plus"
            color="black"
          />
        </Button>
      </Div>
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
