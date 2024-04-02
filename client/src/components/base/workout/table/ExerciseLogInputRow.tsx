import { IExercise, LogType } from "api/types";
import { useState } from "react";
import { View } from "react-native";
import { Div, Input, Text } from "react-native-magnus";
import { useDispatch } from "react-redux";
import { Log, addCompletedLog } from "store/slices/workout";
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

  return (
    <View
      style={
        isCompleted
          ? tableStyles.tableRowComplete
          : tableStyles.tableRowInComplete
      }
    >
      <View style={tableStyles.columnOne}>
        <Text fontSize="2xl">{setNumber + 1}</Text>
      </View>
      <View style={tableStyles.columnOneInput}>
        <Input
          value={weight}
          onChangeText={handleChangeWeight}
          keyboardType="numeric"
          fontSize="2xl"
          borderWidth={0}
          textAlign="center"
          style={{ borderRadius: 15 }}
        />
      </View>
      <View style={tableStyles.columnOneInput}>
        <Input
          value={reps}
          onChangeText={handleChangeReps}
          keyboardType="numeric"
          fontSize="2xl"
          borderWidth={0}
          textAlign="center"
          style={{ borderRadius: 15 }}
        />
      </View>
      <View style={tableStyles.columnOne}>
        <Div>
          <ExerciseLogInputConfirmButton onPress={handleOnCompleted} />
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

  return (
    <View
      style={
        isCompleted
          ? tableStyles.tableRowComplete
          : tableStyles.tableRowInComplete
      }
    >
      <View style={tableStyles.columnOne}>
        <Text fontSize="2xl">{setNumber + 1}</Text>
      </View>
      <View style={tableStyles.columnTwoInput}>
        <Input
          value={seconds}
          onChangeText={handleChangeTimer}
          keyboardType="numeric"
          fontSize="2xl"
          borderWidth={0}
          textAlign="center"
          style={{ borderRadius: 15 }}
        />
      </View>
      <View style={tableStyles.columnOne}>
        <Div>
          <ExerciseLogInputConfirmButton onPress={handleOnCompleted} />
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

  return (
    <View
      style={
        isCompleted
          ? tableStyles.tableRowComplete
          : tableStyles.tableRowInComplete
      }
    >
      <View style={tableStyles.columnOne}>
        <Text fontSize="2xl">{setNumber + 1}</Text>
      </View>
      <View style={tableStyles.columnTwoInput}>
        <Input
          value={reps}
          onChangeText={handleChangeReps}
          keyboardType="numeric"
          fontSize="2xl"
          borderWidth={0}
          textAlign="center"
          style={{ borderRadius: 15 }}
        />
      </View>
      <View style={tableStyles.columnOne}>
        <Div>
          <ExerciseLogInputConfirmButton onPress={handleOnCompleted} />
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
