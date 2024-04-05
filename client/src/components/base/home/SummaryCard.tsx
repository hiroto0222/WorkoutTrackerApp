import globalStyles from "components/styles";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import Card from "./Card";
import BarGraph from "./graph/BarGraph";

type Props = {};

const SummaryCard = (props: Props) => {
  const workoutDataState = useSelector((state: RootState) => state.workoutData);

  const [selectedWorkouts, setSelectedWorkouts] = useState();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text fontSize="3xl" style={globalStyles.textMedium}>
          Past month
        </Text>
        <Div row justifyContent="space-between">
          <Card title="Workouts" width={"45%"}>
            <Text fontSize="xl" style={globalStyles.textMedium}>
              {workoutDataState.workouts.length}
            </Text>
          </Card>
          <Card title="Total Time" width={"45%"}>
            <Text fontSize="xl" style={globalStyles.textMedium}>
              5h30
            </Text>
          </Card>
        </Div>
      </View>
      <BarGraph />
    </View>
  );
};

export default SummaryCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  contentContainer: {
    paddingHorizontal: 25,
  },
});
