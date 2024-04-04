import { IExerciseResponse } from "api/types";
import globalStyles from "components/styles";
import { View } from "react-native";
import { Button, Div, Icon, Text } from "react-native-magnus";
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
        style={globalStyles.textMedium}
        fontSize="2xl"
        color={UIConstants.COLORS.PRIMARY.REGULAR}
      >
        {exercise.name}
      </Text>
      <ExerciseLogHeader logType={exercise.log_type} />
      {workoutState.currLogs[exercise.id].map((log, setNumber) => (
        <ExerciseLogInputRow
          key={setNumber}
          exercise={exercise}
          setNumber={setNumber}
          isCompleted={log.isCompleted}
          isDeletable={
            workoutState.currLogs[exercise.id].length === setNumber + 1
          }
        />
      ))}
      <Div mx="3xl" mt="md" alignItems="center" justifyContent="center">
        <Button
          mx="3xl"
          mb="lg"
          bg={UIConstants.COLORS.GRAY.LIGHT}
          rounded="circle"
          onPress={handleAddEmptySet}
          block
        >
          <Icon
            fontSize="xl"
            fontFamily="MaterialCommunityIcons"
            name="plus"
            color="black"
          />
        </Button>
      </Div>
    </View>
  );
};

export default ExerciseLogInputTable;
