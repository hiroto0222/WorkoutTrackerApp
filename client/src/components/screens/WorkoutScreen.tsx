import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useTimer from "hooks/utils/useTimer";
import { UserStackParams } from "navigation/UserStack";
import { useEffect } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { formatTime } from "utils";

const WorkoutScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParams>>();
  const { seconds } = useTimer();

  const handleFinishWorkout = () => {
    console.log("workout finished");
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          bg="white"
          color="orange500"
          underlayColor="orange100"
          onPress={handleFinishWorkout}
        >
          FINISH
        </Button>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
      <ScrollView>
        <Div px={25}>
          <Text fontSize="3xl" fontWeight="bold">
            Workout
          </Text>
          <Text fontSize="3xl">{formatTime(seconds)}</Text>
          <Div mt="sm" alignItems="center" justifyContent="center">
            <Button
              mx="xl"
              mt="xl"
              mb="xl"
              py="lg"
              bg="orange500"
              rounded="circle"
              block
              onPress={() => navigation.navigate("AddExercise")}
            >
              Add Exercises
            </Button>
          </Div>
        </Div>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutScreen;
