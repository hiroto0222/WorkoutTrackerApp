import { LogType } from "api/types";
import globalStyles from "components/styles";
import { View } from "react-native";
import { Text } from "react-native-magnus";
import { tableStyles } from "./TableStyles";

type Props = {
  logType: LogType;
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
      <Text style={globalStyles.textRegular}>Set</Text>
    </View>
    <View style={tableStyles.columnOne}>
      <Text style={globalStyles.textRegular}>(+kg)</Text>
    </View>
    <View style={tableStyles.columnOne}>
      <Text style={globalStyles.textRegular}>Reps</Text>
    </View>
    <View style={tableStyles.columnOne} />
  </View>
);

const TimerInputHeader = () => (
  <View style={tableStyles.tableHeader}>
    <View style={tableStyles.columnOne}>
      <Text style={globalStyles.textRegular}>Set</Text>
    </View>
    <View style={tableStyles.columnTwo}>
      <Text style={globalStyles.textRegular}>Time</Text>
    </View>
    <View style={tableStyles.columnOne} />
  </View>
);

const RepsInputHeader = () => (
  <View style={tableStyles.tableHeader}>
    <View style={tableStyles.columnOne}>
      <Text style={globalStyles.textRegular}>Set</Text>
    </View>
    <View style={tableStyles.columnTwo}>
      <Text style={globalStyles.textRegular}>Reps</Text>
    </View>
    <View style={tableStyles.columnOne} />
  </View>
);
