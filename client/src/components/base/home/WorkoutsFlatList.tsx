import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "store";
import WorkoutDetailCard from "./WorkoutDetailCard";

const WorkoutsFlatList = () => {
  const workoutDataState = useSelector((state: RootState) => state.workoutData);

  return (
    <FlatList
      contentContainerStyle={styles.flatListContainer}
      data={workoutDataState.workouts}
      renderItem={({ item }) => <WorkoutDetailCard workout={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};

export default WorkoutsFlatList;

const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    paddingBottom: 1000,
  },
});
