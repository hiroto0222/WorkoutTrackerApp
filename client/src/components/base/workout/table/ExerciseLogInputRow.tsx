import { IExerciseResponse, LogType } from "api/types";
import globalStyles from "components/styles";
import { memo, useState } from "react";
import { View } from "react-native";
import { Div, Text } from "react-native-magnus";
import Animated from "react-native-reanimated";
import { useDispatch } from "react-redux";
import {
  Log,
  addCompletedLog,
  deleteLog,
  setInCompleteLog,
} from "store/slices/workout";
import ExerciseLogInput from "./ExerciseLogInput";
import ExerciseLogInputConfirmButton from "./ExerciseLogInputConfirmButton";
import SwipeDelete from "./SwipeDelete";
import { tableStyles } from "./TableStyles";

type Props = {
  exercise: IExerciseResponse;
  setNumber: number;
  isCompleted: boolean;
  isDeletable: boolean;
};

const ExerciseLogInputRow = ({
  exercise,
  setNumber,
  isCompleted,
  isDeletable,
}: Props) => {
  const dispatch = useDispatch();

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [time, setTime] = useState("");

  const handleChangeWeight = (value: string) => {
    setWeight(value);
  };

  const handleChangeReps = (value: string) => {
    setReps(value);
  };

  const handleChangeTime = (value: string) => {
    setTime(value);
  };

  const handleOnCompleted = () => {
    const newLog: Log = {
      weight: parseInt(weight) || undefined,
      reps: parseInt(reps) || undefined,
      time: parseInt(time) || undefined,
      isCompleted: true,
    };
    if (!validateOnComplete(exercise.log_type, newLog)) {
      alert("invalid set!");
      return;
    }
    dispatch(addCompletedLog({ exercise, setNumber, newLog }));
  };

  const handleOnEdit = () => {
    dispatch(setInCompleteLog({ exercise, setNumber }));
  };

  const handleOnDelete = () => {
    dispatch(deleteLog({ exercise, setNumber }));
  };

  return (
    <SwipeDelete isDeletable={isDeletable} onDelete={handleOnDelete}>
      <Animated.View
        style={
          isCompleted
            ? tableStyles.tableRowComplete
            : tableStyles.tableRowInComplete
        }
      >
        <View style={tableStyles.columnOne}>
          <Text
            fontSize="xl"
            style={globalStyles.textMedium}
            color={isCompleted ? "#fff" : "#000"}
          >
            {setNumber + 1}
          </Text>
        </View>
        {exercise.log_type === "weight_reps" && (
          <View style={tableStyles.columnOneInput}>
            <ExerciseLogInput
              isCompleted={isCompleted}
              value={weight}
              handleOnChangeText={handleChangeWeight}
            />
          </View>
        )}
        {(exercise.log_type === "weight_reps" ||
          exercise.log_type === "reps") && (
          <View
            style={
              exercise.log_type === "weight_reps"
                ? tableStyles.columnOneInput
                : tableStyles.columnTwoInput
            }
          >
            <ExerciseLogInput
              isCompleted={isCompleted}
              value={reps}
              handleOnChangeText={handleChangeReps}
            />
          </View>
        )}
        {exercise.log_type === "timer" && (
          <View style={tableStyles.columnTwoInput}>
            <ExerciseLogInput
              isCompleted={isCompleted}
              value={time}
              handleOnChangeText={handleChangeTime}
            />
          </View>
        )}
        <View style={tableStyles.columnOne}>
          <Div>
            <ExerciseLogInputConfirmButton
              isComplete={isCompleted}
              onComplete={handleOnCompleted}
              onEdit={handleOnEdit}
            />
          </Div>
        </View>
      </Animated.View>
    </SwipeDelete>
  );
};

// Avoid rerendering of rows not altered to increase performance
export default memo(ExerciseLogInputRow);

const validateOnComplete = (logType: LogType, log: Log) => {
  switch (logType) {
    case "weight_reps":
      return log.weight != null && log.reps != null;
    case "reps":
      return log.reps != null;
    case "timer":
      return log.time != null;
    default:
      return false;
  }
};
