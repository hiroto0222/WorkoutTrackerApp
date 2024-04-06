import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ExerciseLogInputTable from "components/base/workout/table/ExerciseLogInputTable";
import globalStyles from "components/styles";
import useFinishWorkout from "hooks/api/useFinishWorkout";
import useTimer from "hooks/utils/useTimer";
import { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { formatTime } from "utils";
import UIConstants from "../../../constants";
import { WorkoutStackParams } from "./WorkoutScreenStack";

const WorkoutScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackParams>>();
  const workoutState = useSelector((state: RootState) => state.workout);

  const { seconds } = useTimer();
  const { validateAndCreateWorkoutData, sendWorkoutData } = useFinishWorkout();

  // validate and send workout data
  const handleFinishWorkout = () => {
    const { isValid, exercise_ids, logs } = validateAndCreateWorkoutData();
    if (!isValid) {
      Alert.alert(
        "Please add some exercises and sets to finish your workout!",
        undefined,
        [{ text: "Ok", style: "default", onPress: () => {} }]
      );
      return;
    }

    Alert.alert("Finish workout?", "Any unfinished sets will be discarded", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Confirm",
        style: "destructive",
        onPress: () => {
          sendWorkoutData(exercise_ids, logs);
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
        <Button
          bg="white"
          color={UIConstants.COLORS.GRAY.REGULAR}
          onPress={() => navigation.goBack()}
        >
          CANCEL
        </Button>
      ),
      headerRight: () => (
        <Button
          bg="white"
          color={UIConstants.COLORS.PRIMARY.REGULAR}
          onPress={() => handleFinishWorkout()}
        >
          FINISH
        </Button>
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
        <Text fontSize="3xl" style={globalStyles.textLight}>
          {formatTime(seconds)}
        </Text>
        <Div mt="md" alignItems="center" justifyContent="center">
          <Button
            mx="xl"
            mb="xl"
            py="lg"
            bg={UIConstants.COLORS.PRIMARY.REGULAR}
            rounded="circle"
            block
            onPress={handleOnAddExercises}
          >
            Add Exercises
          </Button>
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
    paddingTop: UIConstants.SCREEN_MARGIN_TOP - 5,
    backgroundColor: UIConstants.COLORS.GRAY.LIGHT,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
