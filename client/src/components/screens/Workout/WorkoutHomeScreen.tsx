import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import globalStyles from "components/styles";
import { Platform, StyleSheet, View } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { useDispatch } from "react-redux";
import { setStartWorkingOut } from "store/slices/workout";
import UIConstants from "../../../constants";
import { WorkoutStackParams } from "./WorkoutScreenStack";

const WorkoutHomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<WorkoutStackParams>>();
  const dispatch = useDispatch();

  const handleStartWorkout = () => {
    dispatch(setStartWorkingOut());
    navigation.navigate("Workout");
  };

  return (
    <View style={styles.container}>
      <Div px={25}>
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
        <Div mt="lg" alignItems="center" justifyContent="center">
          <Button
            onPress={() => handleStartWorkout()}
            mx="xl"
            mt="xl"
            mb="xl"
            py="lg"
            bg={UIConstants.COLORS.PRIMARY.REGULAR}
            rounded="circle"
            block
          >
            Start Workout
          </Button>
        </Div>
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
  },
});
