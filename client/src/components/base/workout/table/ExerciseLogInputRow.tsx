import { IExercise } from "api";
import { useState } from "react";
import { View } from "react-native";
import { Checkbox, Div, Input, Text } from "react-native-magnus";
import { tableStyles } from "./ExerciseLogInputTable";

type Props = {
  exercise: IExercise;
};

const ExerciseLogInputRow = ({ exercise }: Props) => {
  return (
    <>
      {exercise.log_type === "weight_reps" ? (
        <WeightRepsInputRow exercise={exercise} />
      ) : exercise.log_type === "timer" ? (
        <TimerInputRow exercise={exercise} />
      ) : (
        <RepsInputRow exercise={exercise} />
      )}
    </>
  );
};

export default ExerciseLogInputRow;

const WeightRepsInputRow = ({ exercise }: Props) => {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const handleChangeWeight = (value: string) => {
    setWeight(value);
  };

  const handleChangeReps = (value: string) => {
    setReps(value);
  };

  const handleOnChecked = () => {
    console.log(`${exercise.name}: weight-${weight}kg, reps-${reps}`);
  };

  return (
    <View style={tableStyles.tableRow}>
      <View style={tableStyles.columnOne}>
        <Text fontSize="2xl">1</Text>
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
          <Checkbox onChecked={handleOnChecked} />
        </Div>
      </View>
    </View>
  );
};

const TimerInputRow = ({ exercise }: Props) => {
  const [seconds, setSeconds] = useState("");

  const handleChangeTimer = (value: string) => {
    setSeconds(value);
  };

  const handleOnChecked = () => {
    console.log(`${exercise.name}: timer-${seconds}s`);
  };

  return (
    <View style={tableStyles.tableRow}>
      <View style={tableStyles.columnOne}>
        <Text fontSize="2xl">1</Text>
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
          <Checkbox onChecked={handleOnChecked} />
        </Div>
      </View>
    </View>
  );
};

const RepsInputRow = ({ exercise }: Props) => {
  const [reps, setReps] = useState("");

  const handleChangeReps = (value: string) => {
    setReps(value);
  };

  const handleOnChecked = () => {
    console.log(`${exercise.name}: reps-${reps}`);
  };

  return (
    <View style={tableStyles.tableRow}>
      <View style={tableStyles.columnOne}>
        <Text fontSize="2xl">1</Text>
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
          <Checkbox onChecked={handleOnChecked} />
        </Div>
      </View>
    </View>
  );
};
