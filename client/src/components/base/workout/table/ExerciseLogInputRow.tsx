import { IExerciseResponse, LogType } from "api/types";
import globalStyles from "components/styles";
import { memo, useCallback, useState } from "react";
import { View } from "react-native";
import { Div, Text } from "react-native-magnus";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
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
  log: Log;
  exercise: IExerciseResponse;
  setNumber: number;
  isCompleted: boolean;
  isDeletable: boolean;
};

const ExerciseLogInputRow = ({
  log,
  exercise,
  setNumber,
  isCompleted,
  isDeletable,
}: Props) => {
  const dispatch = useDispatch();

  const [weight, setWeight] = useState(
    log.weight !== undefined ? log.weight.toString() : ""
  );
  const [reps, setReps] = useState(
    log.reps !== undefined ? log.reps.toString() : ""
  );
  const [time, setTime] = useState(
    log.time !== undefined ? log.time.toString() : ""
  );

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
      shake();
      return;
    }
    dispatch(addCompletedLog({ exercise, setNumber, newLog }));
    bounce();
  };

  const handleOnEdit = () => {
    dispatch(setInCompleteLog({ exercise, setNumber }));
  };

  const handleOnDelete = () => {
    dispatch(deleteLog({ exercise, setNumber }));
  };

  // Animations
  const shakeTranslateX = useSharedValue(0);
  const scaleTranslate = useSharedValue(1);

  const shake = useCallback(() => {
    const translationAmount = 7;
    const timingConfig = {
      duration: 50,
      easing: Easing.bezier(0.35, 0.7, 0.5, 0.7),
    };
    shakeTranslateX.value = withSequence(
      withTiming(translationAmount, timingConfig),
      withRepeat(withTiming(-translationAmount, timingConfig), 3, true),
      withTiming(0, timingConfig)
    );
  }, []);

  const bounce = useCallback(() => {
    const translationAmount = 1.1;
    const timingConfig = {
      duration: 80,
      easing: Easing.bezier(0.1, 0.3, 0.8, 0.3),
    };
    scaleTranslate.value = withSequence(
      withTiming(translationAmount, timingConfig),
      withTiming(1, timingConfig)
    );
  }, []);

  const rShakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeTranslateX.value }],
    };
  }, []);

  const rBounceStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleTranslate.value }],
    };
  }, []);

  return (
    <Animated.View entering={FadeIn} style={{ marginBottom: 1 }}>
      <SwipeDelete isDeletable={isDeletable} onDelete={handleOnDelete}>
        <Animated.View
          style={[
            isCompleted
              ? tableStyles.tableRowComplete
              : tableStyles.tableRowInComplete,
            rShakeStyle,
            rBounceStyle,
          ]}
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
    </Animated.View>
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
