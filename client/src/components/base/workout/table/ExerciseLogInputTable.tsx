import { IExerciseResponse } from "api/types";
import IconButton from "components/base/common/IconButton";
import globalStyles from "components/styles";
import { View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { addEmptyLog } from "store/slices/workout";
import UIConstants from "../../../../constants";
import ExerciseLogHeader from "./ExerciseLogHeader";
import ExerciseLogInputRow from "./ExerciseLogInputRow";

type Props = {
  exercise: IExerciseResponse;
};

const ExerciseLogInputTable = ({ exercise }: Props) => {
  const dispatch = useDispatch();
  const workoutState = useSelector((state: RootState) => state.workout);

  const handleAddEmptySet = () => {
    dispatch(addEmptyLog(exercise));
  };

  return (
    <View>
      <Text
        px={25}
        mb={10}
        style={globalStyles.textSemiBold}
        fontSize="2xl"
        color="black"
      >
        {exercise.name}
      </Text>
      <ExerciseLogHeader logType={exercise.log_type} />
      {workoutState.currLogs[exercise.id].map((log, setNumber) => (
        <ExerciseLogInputRow
          key={setNumber}
          log={log}
          exercise={exercise}
          setNumber={setNumber}
          isCompleted={log.isCompleted}
          isDeletable={
            workoutState.currLogs[exercise.id].length === setNumber + 1
          }
        />
      ))}
      <Div mx="3xl" m="md" alignItems="center" justifyContent="center">
        <IconButton
          onPress={() => handleAddEmptySet()}
          buttonType="md"
          bg={UIConstants.COLORS.GRAY.LIGHT}
          color={UIConstants.COLORS.GRAY.LIGHT_CONTRAST}
          name="plus"
          fontSize="2xl"
        />
      </Div>
    </View>
  );
};

export default ExerciseLogInputTable;
