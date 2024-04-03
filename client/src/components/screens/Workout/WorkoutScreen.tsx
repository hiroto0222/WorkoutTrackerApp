import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ExerciseLogInputTable from "components/base/workout/table/ExerciseLogInputTable";
import globalStyles from "components/styles";
import useFinishWorkout from "hooks/api/useFinishWorkout";
import useGetExercises from "hooks/utils/useGetExercises";
import useTimer from "hooks/utils/useTimer";
import { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { formatTime } from "utils";
import Constants from "../../../constants";
import { WorkoutStackParams } from "./WorkoutScreenStack";

const WorkoutScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackParams>>();
  const workoutState = useSelector((state: RootState) => state.workout);

  const { seconds } = useTimer();
  const { exercises } = useGetExercises();
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
    if (exercises.length > 0) {
      navigation.navigate("AddExercise", { exercises });
    }
  };

  // add finish workout button to header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          bg="white"
          color="orange500"
          underlayColor="orange100"
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
    <View style={styles.container}>
      <Div px={25}>
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
            bg="orange500"
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
    marginTop: Constants.SCREEN_MARGIN_TOP - 5,
  },
});
