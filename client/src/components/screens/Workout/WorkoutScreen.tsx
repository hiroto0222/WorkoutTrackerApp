import DateTimePicker from "@react-native-community/datetimepicker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "components/base/common/Button";
import ExerciseLogInputTable from "components/base/workout/table/ExerciseLogInputTable";
import globalStyles from "components/styles";
import useFinishWorkout from "hooks/api/useFinishWorkout";
import useDatePicker from "hooks/utils/useDatePicker";
import useTimePicker from "hooks/utils/useTimePicker";
import useTimer from "hooks/utils/useTimer";
import { useEffect } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { formatTime } from "utils";
import UIConstants from "../../../constants";
import { WorkoutStackParams } from "./WorkoutScreenStack";

const WorkoutScreen = () => {
  const route = useRoute<RouteProp<WorkoutStackParams>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackParams>>();
  const workoutState = useSelector((state: RootState) => state.workout);

  const { seconds } = useTimer(route.params?.isAddWorkout!);
  const { validateAndCreateWorkoutData, sendWorkoutData } = useFinishWorkout();

  // show date time picker only if isAddWorkout
  const startDatePicker = useDatePicker();
  const startTimePicker = useTimePicker(false);
  const endTimePicker = useTimePicker(true);

  // validate and send workout data
  const handleFinishWorkout = () => {
    const isAddWorkout = route.params?.isAddWorkout!;

    const { isValid, exercise_ids, logs, message } =
      validateAndCreateWorkoutData(isAddWorkout);

    if (!isValid) {
      Alert.alert(message, undefined, [
        { text: "Ok", style: "default", onPress: () => {} },
      ]);
      return;
    }

    Alert.alert("Finish workout?", "Any unfinished sets will be discarded", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Confirm",
        style: "destructive",
        onPress: () => {
          sendWorkoutData(isAddWorkout, exercise_ids, logs);
        },
      },
    ]);
  };

  const handleOnAddExercises = () => {
    navigation.navigate("AddExercise");
  };

  // add finish workout button to header
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Text
            color={UIConstants.COLORS.GRAY.REGULAR}
            style={globalStyles.textMedium}
            fontSize="xl"
          >
            CANCEL
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => handleFinishWorkout()}
        >
          <Text
            color={UIConstants.COLORS.PRIMARY.REGULAR}
            style={globalStyles.textBold}
            fontSize="xl"
          >
            FINISH
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [workoutState]);

  // warn user when going back
  useEffect(() => {
    const removeListener = navigation.addListener("beforeRemove", (e) => {
      // if user has already finished workout, ignore
      if (workoutState.isFinished) {
        return;
      }

      e.preventDefault();
      Alert.alert(
        "Discard workout?",
        "All changes will be unsaved, do you want to discard your current workout?",
        [
          { text: "Don't leave", style: "cancel", onPress: () => {} },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return () => {
      removeListener();
    };
  }, [navigation, workoutState.isFinished]);

  return (
    <View>
      <Div px={25} style={styles.container}>
        <Text fontSize="3xl" style={globalStyles.textMedium}>
          Workout
        </Text>
        {!route.params?.isAddWorkout && (
          <Text fontSize="3xl" style={globalStyles.textLight}>
            {formatTime(seconds)}
          </Text>
        )}
        <Div mt="md" mb="lg" alignItems="center" justifyContent="center">
          <Button
            buttonType="md"
            bg={UIConstants.COLORS.PRIMARY.REGULAR}
            onPress={handleOnAddExercises}
            text="Add Exercises"
            color="#fff"
            fontSize="xl"
          />
          {route.params?.isAddWorkout && (
            <Div
              style={{ width: "100%", marginTop: 10 }}
              row
              justifyContent="space-between"
              alignItems="center"
            >
              {Platform.OS === "android" && (
                <Button
                  buttonType="md"
                  bg="#fff"
                  onPress={startDatePicker.showDatePicker}
                  text={startDatePicker.date.toDateString().substring(0, 10)}
                  color={UIConstants.COLORS.GRAY.REGULAR}
                  fontSize="lg"
                  width="35%"
                />
              )}
              {startDatePicker.show && (
                <DateTimePicker
                  maximumDate={new Date()}
                  testID="workoutDateTimePicker"
                  value={startDatePicker.date}
                  mode={startDatePicker.mode}
                  display="default"
                  onChange={startDatePicker.onChange}
                />
              )}
              <Text fontSize="4xl"> </Text>
              {Platform.OS === "android" && (
                <Button
                  buttonType="md"
                  bg="#fff"
                  onPress={startTimePicker.showTimePicker}
                  text={startTimePicker.date.toTimeString().substring(0, 5)}
                  color={UIConstants.COLORS.GRAY.REGULAR}
                  fontSize="xl"
                  width="25%"
                />
              )}
              {startTimePicker.show && (
                <DateTimePicker
                  testID="workoutStartTimePicker"
                  value={startTimePicker.date}
                  mode={startTimePicker.mode}
                  is24Hour={true}
                  display="default"
                  onChange={startTimePicker.onChange}
                />
              )}
              <Text mb={5} textAlign="center" fontSize="4xl">
                ~
              </Text>
              {Platform.OS === "android" && (
                <Button
                  buttonType="md"
                  bg="#fff"
                  onPress={endTimePicker.showTimePicker}
                  text={endTimePicker.date.toTimeString().substring(0, 5)}
                  color={UIConstants.COLORS.GRAY.REGULAR}
                  fontSize="xl"
                  width="25%"
                />
              )}
              {endTimePicker.show && (
                <DateTimePicker
                  minimumDate={startTimePicker.date}
                  testID="workoutEndTimePicker"
                  value={endTimePicker.date}
                  mode={endTimePicker.mode}
                  is24Hour={true}
                  display="default"
                  onChange={endTimePicker.onChange}
                />
              )}
            </Div>
          )}
        </Div>
      </Div>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={{
          flexGrow: 1,
          marginTop: 15,
          paddingBottom: 250,
        }}
      >
        {workoutState.currExercises.map((exercise) => (
          <ExerciseLogInputTable key={exercise.id} exercise={exercise} />
        ))}
      </ScrollView>
    </View>
  );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: UIConstants.SCREEN_MARGIN_TOP - 15,
    backgroundColor: UIConstants.COLORS.GRAY.LIGHT,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
