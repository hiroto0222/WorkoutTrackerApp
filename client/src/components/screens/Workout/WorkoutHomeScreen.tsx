import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "components/base/common/Button";
import globalStyles from "components/styles";
import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Div, Text } from "react-native-magnus";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setStartWorkingOut } from "store/slices/workout";
import UIConstants from "../../../constants";
import { WorkoutStackParams } from "./WorkoutScreenStack";

const WorkoutHomeScreen = () => {
  const workoutState = useSelector((state: RootState) => state.workout);
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackParams>>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (workoutState.isActive) {
      navigation.navigate("Workout", {
        isAddWorkout: workoutState.isAddWorkout,
      });
    }
  }, []);

  const handleStartWorkout = (isAddWorkout: boolean) => {
    dispatch(setStartWorkingOut(isAddWorkout));
    navigation.navigate("Workout", { isAddWorkout });
  };

  return (
    <View style={[styles.container, { marginBottom: tabBarHeight }]}>
      <Div row justifyContent={"space-between"} alignItems="center">
        <Div>
          <Div row>
            <Text fontSize="6xl" style={globalStyles.textMedium}>
              Workout
            </Text>
          </Div>
          <Text fontSize="lg" style={globalStyles.textMedium}>
            Get some exercise in!
          </Text>
        </Div>
      </Div>
      <Div my={10} alignItems="center" justifyContent="center">
        <Button
          buttonType="lg"
          onPress={() => handleStartWorkout(true)}
          bg={UIConstants.COLORS.GRAY.LIGHT}
          color={UIConstants.COLORS.GRAY.LIGHT_CONTRAST}
          text="Add Workout"
          fontSize="xl"
          marginVertical={10}
        />
        <Button
          buttonType="lg"
          onPress={() => handleStartWorkout(false)}
          bg={UIConstants.COLORS.PRIMARY.REGULAR}
          color={UIConstants.COLORS.PRIMARY.CONTRAST}
          text="Start Workout"
          fontSize="xl"
          marginVertical={10}
        />
      </Div>
    </View>
  );
};

export default WorkoutHomeScreen;

const styles = StyleSheet.create({
  container: {
    marginTop:
      Platform.OS === "android"
        ? UIConstants.SCREEN_MARGIN_TOP
        : UIConstants.SCREEN_MARGIN_TOP + 30,
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: "space-between",
  },
});
