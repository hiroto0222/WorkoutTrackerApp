import { StyleSheet, Text, View } from "react-native";

const WorkoutScreen = () => {
  return (
    <View style={styles.container}>
      <Text>WorkoutScreen</Text>
    </View>
  );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
