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
      name: "Plank",
      log_type: "timer",
    },
    {
      id: 5,
      name: "Bench Press",
      log_type: "weight_reps",
    },
    {
      id: 6,
      name: "Sit Up",
      log_type: "reps",
    },
    {
      id: 7,
      name: "Plank",
      log_type: "timer",
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
