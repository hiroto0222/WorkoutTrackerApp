import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ExerciseLogInputTable from "components/base/workout/table/ExerciseLogInputTable";
import useFinishWorkout from "hooks/api/useFinishWorkout";
import useGetExercises from "hooks/utils/useGetExercises";
import useTimer from "hooks/utils/useTimer";
import { UserStackParams } from "navigation/UserStack";
import { useEffect } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { formatTime } from "utils";

const WorkoutScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParams>>();
  const workoutState = useSelector((state: RootState) => state.workout);

  const { seconds } = useTimer();
  const { exercises } = useGetExercises();
  const { validateAndCreateWorkoutData, sendWorkoutData } = useFinishWorkout();

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
      console.log(workoutState.isFinished);
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
      <SafeAreaView style={{ flex: 1, marginTop: 20 }} />
      <Div px={25}>
        <Text fontSize="3xl" fontWeight="bold">
          Workout
        </Text>
        <Text fontSize="3xl">{formatTime(seconds)}</Text>
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
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 350,
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
