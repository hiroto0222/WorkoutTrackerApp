import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { IExercise } from "api/types";
import ConfirmSelectionButton from "components/utils/ConfirmSelectionButton";
import ExerciseCheckBox from "components/utils/ExerciseCheckBox";
import { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Checkbox, Div, Text } from "react-native-magnus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { addCurrExercises } from "store/slices/workout";
import { WorkoutStackParams } from "./WorkoutScreenStack";

const AddExerciseScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<WorkoutStackParams, "AddExercise">>();
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 50,
          }}
          style={{ marginTop: 15 }}
        >
          <Div>
            <Checkbox.Group>
              {route.params.exercises.map((exercise) => (
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
