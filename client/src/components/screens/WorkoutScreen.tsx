import Constants from "expo-constants";
import { SafeAreaView } from "react-native";
import { StatusBar, Text } from "react-native-magnus";

const WorkoutScreen = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
        <Text mt="sm" mx="xl" w="70%" fontWeight="bold" fontSize="5xl">
          WorkoutScreen
        </Text>
      </SafeAreaView>
    </>
  );
};

export default WorkoutScreen;
