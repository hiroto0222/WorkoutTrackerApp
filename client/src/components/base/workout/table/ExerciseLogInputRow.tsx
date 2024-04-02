import { IExercise } from "api/types";
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
};

const ExerciseLogInputRow = ({ exercise, setNumber }: Props) => {
  return (
    <>
      {exercise.log_type === "weight_reps" ? (
        <WeightRepsInputRow exercise={exercise} setNumber={setNumber} />
      ) : exercise.log_type === "timer" ? (
        <TimerInputRow exercise={exercise} setNumber={setNumber} />
      ) : (
        <RepsInputRow exercise={exercise} setNumber={setNumber} />
      )}
    </>
  );
};

export default ExerciseLogInputRow;

const WeightRepsInputRow = ({ exercise, setNumber }: Props) => {
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
    console.log(`${exercise.name}: weight-${weight}kg, reps-${reps}`);
    const newLog: Log = { weight: parseInt(weight), reps: parseInt(reps) };
    dispatch(addCompletedLog({ exercise, setNumber, newLog }));
  };

  return (
    <View style={tableStyles.tableRow}>
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

const TimerInputRow = ({ exercise, setNumber }: Props) => {
  const dispatch = useDispatch();

  const [seconds, setSeconds] = useState("");

  const handleChangeTimer = (value: string) => {
    setSeconds(value);
  };

  const handleOnCompleted = () => {
    console.log(`${exercise.name}: timer-${seconds}s`);
    const newLog: Log = { timer: parseInt(seconds) };
    dispatch(addCompletedLog({ exercise, setNumber, newLog }));
  };

  return (
    <View style={tableStyles.tableRow}>
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

const RepsInputRow = ({ exercise, setNumber }: Props) => {
  const dispatch = useDispatch();

  const [reps, setReps] = useState("");

  const handleChangeReps = (value: string) => {
    setReps(value);
  };

  const handleOnCompleted = () => {
    console.log(`${exercise.name}: reps-${reps}`);
    const newLog: Log = { reps: parseInt(reps) };
    dispatch(addCompletedLog({ exercise, setNumber, newLog }));
  };

  return (
    <View style={tableStyles.tableRow}>
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
