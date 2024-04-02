import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ExerciseLogInputTable from "components/base/workout/table/ExerciseLogInputTable";
import useFinishWorkout from "hooks/api/useFinishWorkout";
import useGetExercises from "hooks/utils/useGetExercises";
import useTimer from "hooks/utils/useTimer";
import { UserStackParams } from "navigation/UserStack";
import { useEffect } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { formatTime } from "utils";

const WorkoutScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParams>>();
  const workoutState = useSelector((state: RootState) => state.workout);
  const authState = useSelector((state: RootState) => state.auth);

  const { seconds } = useTimer();
  const { exercises } = useGetExercises();
  const { finishWorkout } = useFinishWorkout();

  const handleFinishWorkout = () => {
    if (authState.userId) {
      finishWorkout(authState.userId);
    }
  };

  const handleOnAddExercises = () => {
    if (exercises.length > 0) {
      navigation.navigate("AddExercise", { exercises });
    }
  };

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
