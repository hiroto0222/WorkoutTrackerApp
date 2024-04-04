import { IWorkoutsResponse } from "api/types";
import globalStyles from "components/styles";
import { StyleSheet } from "react-native";
import { Div, Text } from "react-native-magnus";
import UIConstants from "../../../constants";

type Props = {
  workout: IWorkoutsResponse;
};

const WorkoutDetailCard = ({ workout }: Props) => {
  return (
    <Div style={styles.item}>
      <Text style={globalStyles.textRegular}>id: {workout.id}</Text>
      <Text style={globalStyles.textRegular}>
        start date: {workout.started_at}
      </Text>
      <Text style={globalStyles.textRegular}>end date: {workout.ended_at}</Text>
    </Div>
  );
};

export default WorkoutDetailCard;

const styles = StyleSheet.create({
  item: {
    backgroundColor: UIConstants.COLORS.PRIMARY.LIGHT,
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "flex-start",
  },
});
