import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { useDispatch } from "react-redux";
import { setStartWorkingOut } from "store/slices/workout";
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
    <View>
      <SafeAreaView
        style={{ flex: 1, marginTop: Constants.statusBarHeight + 30 }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 350,
        }}
      >
        <Div px={25}>
          <Div row justifyContent={"space-between"} alignItems="center">
            <Div>
              <Div row>
                <Text fontSize="5xl" mr={5}>
                  Workout
                </Text>
              </Div>
              <Text fontSize="lg">Get some exercise in!</Text>
            </Div>
          </Div>
          <Div mt="lg" alignItems="center" justifyContent="center">
            <Button
              onPress={() => handleStartWorkout()}
              mx="xl"
              mt="xl"
              mb="xl"
              py="lg"
              bg="orange500"
              rounded="circle"
              block
            >
              Start Workout
            </Button>
          </Div>
        </Div>
      </ScrollView>
    </View>
  );
};

export default WorkoutHomeScreen;
