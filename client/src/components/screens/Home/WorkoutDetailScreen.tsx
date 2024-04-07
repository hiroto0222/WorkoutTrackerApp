import { RouteProp, useRoute } from "@react-navigation/native";
import globalStyles from "components/styles";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Div, Icon, Text } from "react-native-magnus";
import {
  calculateTimeDifference,
  formatTimeAMPM,
  formatTimeDifference,
  getNameOfWeekday,
} from "utils";
import UIConstants from "../../../constants";
import { HomeStackParams } from "./HomeScreenStack";

const WorkoutDetailScreen = () => {
  const route = useRoute<RouteProp<HomeStackParams>>();
  const workout = route.params?.workout!;
  const exercises = route.params?.exerciseLogs.exercises!;
  const logs = route.params?.exerciseLogs.logs!;

  const workoutDate = new Date(workout.started_at);
  const workoutEndDate = new Date(workout.ended_at);
  const workoutWeekdayName = getNameOfWeekday(workoutDate);

  const { hours, minutes } = calculateTimeDifference(
    workoutDate,
    workoutEndDate
  );

  return (
    <View>
      <Div px={25} style={styles.container}>
        <Text fontSize="5xl" style={globalStyles.textMedium}>
          {workoutWeekdayName} Workout
        </Text>
        <Text fontSize="xl" style={globalStyles.textRegular}>
          {workoutDate.toDateString().substring(4)}
          {", "}
          {formatTimeAMPM(workoutDate)}
        </Text>
        <Div row mt={5} alignItems="center">
          <Icon
            pr={5}
            fontSize="2xl"
            fontFamily="MaterialCommunityIcons"
            name="clock"
            color={UIConstants.COLORS.GRAY.REGULAR}
          />
          <Text fontSize="lg" style={globalStyles.textRegular}>
            {formatTimeDifference(hours, minutes)}
          </Text>
        </Div>
      </Div>
    </View>
  );
};

export default WorkoutDetailScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: UIConstants.SCREEN_MARGIN_TOP - 15,
  },
});
