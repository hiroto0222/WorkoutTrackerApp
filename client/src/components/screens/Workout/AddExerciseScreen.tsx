import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { IExercise } from "api/types";
import ConfirmSelectionButton from "components/base/workout/ConfirmSelectionButton";
import ExerciseCheckBox from "components/base/workout/ExerciseCheckBox";
import globalStyles from "components/styles";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Checkbox, Div, Text } from "react-native-magnus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { addCurrExercises } from "store/slices/workout";
import UIConstants from "../../../constants";
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
    <View style={styles.container}>
      <Div px={25}>
        <Text fontSize="3xl" style={globalStyles.textMedium}>
          Add Exercises
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
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
    </View>
  );
};

export default AddExerciseScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: UIConstants.SCREEN_MARGIN_TOP - 5,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 130,
  },
});
