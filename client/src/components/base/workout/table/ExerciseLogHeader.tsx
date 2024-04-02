import { View } from "react-native";
import { Text } from "react-native-magnus";
import { tableStyles } from "./TableStyles";

type Props = {
  logType: string;
};

const ExerciseLogHeader = ({ logType }: Props) => {
  return (
    <>
      {logType === "weight_reps" ? (
        <WeightRepsInputHeader />
      ) : logType === "timer" ? (
        <TimerInputHeader />
      ) : (
        <RepsInputHeader />
      )}
    </>
  );
};

export default ExerciseLogHeader;

const WeightRepsInputHeader = () => (
  <View style={tableStyles.tableHeader}>
    <View style={tableStyles.columnOne}>
      <Text>Set</Text>
    </View>
    <View style={tableStyles.columnOne}>
      <Text>(+kg)</Text>
    </View>
    <View style={tableStyles.columnOne}>
      <Text>Reps</Text>
    </View>
    <View style={tableStyles.columnOne} />
  </View>
);

const TimerInputHeader = () => (
  <View style={tableStyles.tableHeader}>
    <View style={tableStyles.columnOne}>
      <Text>Set</Text>
    </View>
    <View style={tableStyles.columnTwo}>
      <Text>Time</Text>
    </View>
    <View style={tableStyles.columnOne} />
  </View>
);

const RepsInputHeader = () => (
  <View style={tableStyles.tableHeader}>
    <View style={tableStyles.columnOne}>
      <Text>Set</Text>
    </View>
    <View style={tableStyles.columnTwo}>
      <Text>Reps</Text>
    </View>
    <View style={tableStyles.columnOne} />
  </View>
);
