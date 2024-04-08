import { IExerciseResponse, LogType } from "api/types";
import globalStyles from "components/styles";
import { memo, useState } from "react";
import { Animated, I18nManager, StyleSheet, View } from "react-native";
import {
  GestureHandlerRootView,
  RectButton,
} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Div, Icon, Text } from "react-native-magnus";
import { useDispatch } from "react-redux";
import {
  Log,
  addCompletedLog,
  deleteLog,
  setInCompleteLog,
} from "store/slices/workout";
import UIConstants from "../../../../constants";
import ExerciseLogInput from "./ExerciseLogInput";
import ExerciseLogInputConfirmButton from "./ExerciseLogInputConfirmButton";
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
  return (
    <>
      {exercise.log_type === "weight_reps" ? (
        <WeightRepsInputRow
          exercise={exercise}
          setNumber={setNumber}
          isCompleted={isCompleted}
          isDeletable={isDeletable}
        />
      ) : exercise.log_type === "timer" ? (
        <TimerInputRow
          exercise={exercise}
          setNumber={setNumber}
          isCompleted={isCompleted}
          isDeletable={isDeletable}
        />
      ) : (
        <RepsInputRow
          exercise={exercise}
          setNumber={setNumber}
          isCompleted={isCompleted}
          isDeletable={isDeletable}
        />
      )}
    </>
  );
};

// Avoid rerendering of rows not altered to increase performance
export default memo(ExerciseLogInputRow);

const WeightRepsInputRow = ({
  exercise,
  setNumber,
  isCompleted,
  isDeletable,
}: Props) => {
  const dispatch = useDispatch();

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const handleChangeWeight = (value: string) => {
    setWeight(value);
  };

  const handleChangeReps = (value: string) => {
    setReps(value);
  };

  const handleOnCompleted = () => {
    const newLog: Log = {
      weight: parseInt(weight) || undefined,
      reps: parseInt(reps) || undefined,
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

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <RectButton style={styles.rightAction} onPress={handleOnDelete}>
        <Animated.View
          style={[tableStyles.columnOne, { transform: [{ scale }] }]}
        >
          <Icon
            fontSize="4xl"
            fontFamily="MaterialCommunityIcons"
            name="delete"
            color="#fff"
          />
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        enabled={isDeletable}
        renderRightActions={renderRightActions}
        rightThreshold={30}
      >
        <View
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
          <View style={tableStyles.columnOneInput}>
            <ExerciseLogInput
              isCompleted={isCompleted}
              value={weight}
              handleOnChangeText={handleChangeWeight}
            />
          </View>
          <View style={tableStyles.columnOneInput}>
            <ExerciseLogInput
              isCompleted={isCompleted}
              value={reps}
              handleOnChangeText={handleChangeReps}
            />
          </View>
          <View style={tableStyles.columnOne}>
            <Div>
              <ExerciseLogInputConfirmButton
                isComplete={isCompleted}
                onComplete={handleOnCompleted}
                onEdit={handleOnEdit}
              />
            </Div>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const TimerInputRow = ({
  exercise,
  setNumber,
  isCompleted,
  isDeletable,
}: Props) => {
  const dispatch = useDispatch();

  const [seconds, setSeconds] = useState("");

  const handleChangeTimer = (value: string) => {
    setSeconds(value);
  };

  const handleOnCompleted = () => {
    const newLog: Log = {
      time: parseInt(seconds) || undefined,
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

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <RectButton style={styles.rightAction} onPress={handleOnDelete}>
        <Animated.View
          style={[tableStyles.columnOne, { transform: [{ scale }] }]}
        >
          <Icon
            fontSize="4xl"
            fontFamily="MaterialCommunityIcons"
            name="delete"
            color="#fff"
          />
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        enabled={isDeletable}
        renderRightActions={renderRightActions}
        rightThreshold={30}
      >
        <View
          style={
            isCompleted
              ? tableStyles.tableRowComplete
              : tableStyles.tableRowInComplete
          }
        >
          <View style={tableStyles.columnOne}>
            <Text fontSize="xl" style={globalStyles.textMedium}>
              {setNumber + 1}
            </Text>
          </View>
          <View style={tableStyles.columnTwoInput}>
            <ExerciseLogInput
              isCompleted={isCompleted}
              value={seconds}
              handleOnChangeText={handleChangeTimer}
            />
          </View>
          <View style={tableStyles.columnOne}>
            <Div>
              <ExerciseLogInputConfirmButton
                isComplete={isCompleted}
                onComplete={handleOnCompleted}
                onEdit={handleOnEdit}
              />
            </Div>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const RepsInputRow = ({
  exercise,
  setNumber,
  isCompleted,
  isDeletable,
}: Props) => {
  const dispatch = useDispatch();

  const [reps, setReps] = useState("");

  const handleChangeReps = (value: string) => {
    setReps(value);
  };

  const handleOnCompleted = () => {
    const newLog: Log = {
      reps: parseInt(reps) || undefined,
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

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <RectButton style={styles.rightAction} onPress={handleOnDelete}>
        <Animated.View
          style={[tableStyles.columnOne, { transform: [{ scale }] }]}
        >
          <Icon
            fontSize="4xl"
            fontFamily="MaterialCommunityIcons"
            name="delete"
            color="#fff"
          />
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        enabled={isDeletable}
        renderRightActions={renderRightActions}
        rightThreshold={30}
      >
        <View
          style={
            isCompleted
              ? tableStyles.tableRowComplete
              : tableStyles.tableRowInComplete
          }
        >
          <View style={tableStyles.columnOne}>
            <Text fontSize="xl" style={globalStyles.textMedium}>
              {setNumber + 1}
            </Text>
          </View>
          <View style={tableStyles.columnTwoInput}>
            <ExerciseLogInput
              isCompleted={isCompleted}
              value={reps}
              handleOnChangeText={handleChangeReps}
            />
          </View>
          <View style={tableStyles.columnOne}>
            <Div>
              <ExerciseLogInputConfirmButton
                isComplete={isCompleted}
                onComplete={handleOnCompleted}
                onEdit={handleOnEdit}
              />
            </Div>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

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

const styles = StyleSheet.create({
  rightAction: {
    alignItems: "center",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    backgroundColor: UIConstants.COLORS.PRIMARY.REGULAR,
    flex: 1,
    justifyContent: "flex-end",
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10,
    backgroundColor: "plum",
    height: 20,
  },
});
