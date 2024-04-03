import { IExercise, LogType } from "api/types";
import globalStyles from "components/styles";
import { useState } from "react";
import { View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { useDispatch } from "react-redux";
import { Log, addCompletedLog, setInCompleteLog } from "store/slices/workout";
import ExerciseLogInput from "./ExerciseLogInput";
import ExerciseLogInputConfirmButton from "./ExerciseLogInputConfirmButton";
import { tableStyles } from "./TableStyles";

type Props = {
  exercise: IExercise;
  setNumber: number;
  isCompleted: boolean;
};

const ExerciseLogInputRow = ({ exercise, setNumber, isCompleted }: Props) => {
  return (
    <>
      {exercise.log_type === "weight_reps" ? (
        <WeightRepsInputRow
          exercise={exercise}
          setNumber={setNumber}
          isCompleted={isCompleted}
        />
      ) : exercise.log_type === "timer" ? (
        <TimerInputRow
          exercise={exercise}
          setNumber={setNumber}
          isCompleted={isCompleted}
        />
      ) : (
        <RepsInputRow
          exercise={exercise}
          setNumber={setNumber}
          isCompleted={isCompleted}
        />
      )}
    </>
  );
};

export default ExerciseLogInputRow;

const WeightRepsInputRow = ({ exercise, setNumber, isCompleted }: Props) => {
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

  return (
    <View
      style={
        isCompleted
          ? tableStyles.tableRowComplete
          : tableStyles.tableRowInComplete
      }
    >
      <View style={tableStyles.columnOne}>
        <Text fontSize="xl" style={globalStyles.textRegular}>
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
  );
};

const TimerInputRow = ({ exercise, setNumber, isCompleted }: Props) => {
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

  return (
    <View
      style={
        isCompleted
          ? tableStyles.tableRowComplete
          : tableStyles.tableRowInComplete
      }
    >
      <View style={tableStyles.columnOne}>
        <Text fontSize="xl" style={globalStyles.textRegular}>
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
  );
};

const RepsInputRow = ({ exercise, setNumber, isCompleted }: Props) => {
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

  return (
    <View
      style={
        isCompleted
          ? tableStyles.tableRowComplete
          : tableStyles.tableRowInComplete
      }
    >
      <View style={tableStyles.columnOne}>
        <Text fontSize="xl" style={globalStyles.textRegular}>
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
