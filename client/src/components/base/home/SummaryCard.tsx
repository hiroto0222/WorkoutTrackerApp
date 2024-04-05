import { IWorkoutsResponse } from "api/types";
import globalStyles from "components/styles";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import {
  formatDateToString,
  getStartOfWeek,
  getStartingDatesForPastWeeks,
} from "utils";
import Card from "./Card";
import BarGraph, { BarGraphData } from "./graph/BarGraph";

const SummaryCard = () => {
  const workoutDataState = useSelector((state: RootState) => state.workoutData);

  const [selectedWorkoutData, setSelectedWorkoutData] =
    useState<BarGraphData | null>(null);
  const [barGraphData, setBarGraphData] = useState<BarGraphData[]>([]);

  // bin workout data into per week
  useEffect(() => {
    const startingDates = getStartingDatesForPastWeeks(7);
    const bins: { [key: string]: IWorkoutsResponse[] } = {};
    startingDates.forEach((date) => (bins[formatDateToString(date)] = []));

    for (let i = 0; i < workoutDataState.workouts.length; i++) {
      const currWorkout = workoutDataState.workouts[i];
      const currDate = new Date(currWorkout.started_at);
      const currStartingDate = getStartOfWeek(currDate);

      // if currDate is less than the minimum startingDates bin, exit loop
      const minDate = new Date(startingDates[0].toDateString());
      if (minDate > currDate) {
        break;
      }

      const formattedCurrStartingDate = formatDateToString(currStartingDate);
      bins[formattedCurrStartingDate].push(currWorkout);
    }

    const data: BarGraphData[] = [];
    // format binned data to BarGraphData
    for (let i = 0; i < startingDates.length; i++) {
      const currLabel = formatDateToString(startingDates[i]);
      data.push({
        label: currLabel,
        value: bins[currLabel],
      });
    }

    setBarGraphData(data);
  }, [workoutDataState.workouts]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text fontSize="3xl" style={globalStyles.textMedium}>
          {selectedWorkoutData === null
            ? "Past months"
            : `Week ${selectedWorkoutData.label}`}
        </Text>
        <Div row justifyContent="space-between">
          <Card title="Workouts" width={"45%"}>
            <Text fontSize="xl" style={globalStyles.textMedium}>
              {selectedWorkoutData === null
                ? workoutDataState.workouts.length
                : selectedWorkoutData.value.length}
            </Text>
          </Card>
          <Card title="Total Time" width={"45%"}>
            <Text fontSize="xl" style={globalStyles.textMedium}>
              5h30
            </Text>
          </Card>
        </Div>
      </View>
      <BarGraph
        data={barGraphData}
        setSelectedWorkoutData={setSelectedWorkoutData}
        isEmptyData={workoutDataState.workouts.length === 0}
      />
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
