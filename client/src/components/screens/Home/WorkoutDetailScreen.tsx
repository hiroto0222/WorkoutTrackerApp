import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import globalStyles from "components/styles";
import useDeleteWorkout from "hooks/api/useDeleteWorkout";
import React, { useEffect } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
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
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();
  const route = useRoute<RouteProp<HomeStackParams>>();

  const { deleteWorkout } = useDeleteWorkout();

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

  const handleOnDelete = () => {
    Alert.alert(
      "Delete workout?",
      "You cannot undo this change, are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
          isPreferred: true,
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteWorkout(workout.id);
          },
        },
      ]
    );
  };

  // add finish workout button to header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => handleOnDelete()}
        >
          <Icon
            fontSize="5xl"
            fontFamily="MaterialCommunityIcons"
            name="trash-can"
            color={UIConstants.COLORS.PRIMARY.REGULAR}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

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
