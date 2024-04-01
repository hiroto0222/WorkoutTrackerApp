import { useNavigation } from "@react-navigation/native";
import { IExercise } from "api";
import ExerciseCheckBox from "components/utils/ExerciseCheckBox";
import { useState } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import { Checkbox, Div, Icon, Text } from "react-native-magnus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { addCurrExercises } from "store/slices/workout";

const AddExerciseScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const workoutState = useSelector((state: RootState) => state.workout);

  const [selectedExercises, setSelectedExercises] = useState<IExercise[]>([]);

  const handleOnCheckedExercise = (checked: boolean, exercise: IExercise) => {
    if (checked) {
      setSelectedExercises((prev) => [...prev, exercise]);
    } else {
      const filtered = selectedExercises.filter(
        (value) => value.id != exercise.id
      );
      setSelectedExercises(filtered);
    }
  };

  // add selected exercises to current workout and navigate back to WorkoutScreen
  const handleOnConfirmation = () => {
    console.log(selectedExercises);
    dispatch(addCurrExercises(selectedExercises));
    navigation.goBack();
  };

  // check if exercise has already been added to current workout
  const isDuplicateExercise = (exerciseId: number) => {
    return (
      workoutState.currExercises.filter((exercise) => exercise.id == exerciseId)
        .length > 0
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
      <Div px={25}>
        <Text fontSize="3xl" fontWeight="bold">
          Add Exercises
        </Text>
        <ScrollView style={{ marginTop: 15 }}>
          <Div>
            <Checkbox.Group>
              {exercises.map((exercise) => (
                <ExerciseCheckBox
                  key={exercise.id}
                  value={exercise}
                  disabled={isDuplicateExercise(exercise.id)}
                  handleOnChecked={handleOnCheckedExercise}
                />
              ))}
            </Checkbox.Group>
          </Div>
        </ScrollView>
        {selectedExercises.length > 0 && (
          <ConfirmSelectionButton onPress={handleOnConfirmation} />
        )}
      </Div>
    </SafeAreaView>
  );
};

export default AddExerciseScreen;

type Props = {
  onPress: () => void;
};

const ConfirmSelectionButton = ({ onPress }: Props) => (
  <TouchableOpacity
    style={{
      position: "absolute",
      bottom: 65,
      right: 15,
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#ed8936",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon fontSize="6xl" fontFamily="AntDesign" name="check" color="#fff" />
    </View>
  </TouchableOpacity>
);

const exercises: IExercise[] = [
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
