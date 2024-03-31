import ExerciseCheckBox from "components/utils/ExerciseCheckBox";
import { SafeAreaView, ScrollView } from "react-native";
import { Checkbox, Div, Text } from "react-native-magnus";

export type Exercise = {
  id: number;
  name: string;
  log_type: string;
};

const AddExerciseScreen = () => {
  const exercises: Exercise[] = [
    {
      id: 1,
      name: "Plank",
      log_type: "timer",
    },
    {
      id: 2,
      name: "Bench Press",
      log_type: "weight_reps",
    },
    {
      id: 3,
      name: "Sit Up",
      log_type: "reps",
    },
    {
      id: 4,
      name: "Squats",
      log_type: "weight_reps",
    },
    {
      id: 5,
      name: "Deadlift",
      log_type: "weight_reps",
    },
    {
      id: 6,
      name: "Push-up",
      log_type: "reps",
    },
    {
      id: 7,
      name: "Pull-up",
      log_type: "reps",
    },
    {
      id: 8,
      name: "Lunges",
      log_type: "reps",
    },
    {
      id: 9,
      name: "Dumbbell Shoulder Press",
      log_type: "weight_reps",
    },
    {
      id: 10,
      name: "Russian Twist",
      log_type: "reps",
    },
    {
      id: 11,
      name: "Burpees",
      log_type: "reps",
    },
    {
      id: 12,
      name: "Leg Raises",
      log_type: "reps",
    },
    {
      id: 13,
      name: "Chest Fly",
      log_type: "weight_reps",
    },
    {
      id: 14,
      name: "Triceps Dips",
      log_type: "reps",
    },
    {
      id: 15,
      name: "Bicep Curls",
      log_type: "weight_reps",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
      <Div px={25}>
        <Text fontSize="3xl" fontWeight="bold">
          Add Exercises
        </Text>
        <ScrollView>
          <Div mt={15}>
            <Checkbox.Group>
              {exercises.map((exercise) => (
                <ExerciseCheckBox key={exercise.id} value={exercise} />
              ))}
            </Checkbox.Group>
          </Div>
        </ScrollView>
      </Div>
    </SafeAreaView>
  );
};

export default AddExerciseScreen;
