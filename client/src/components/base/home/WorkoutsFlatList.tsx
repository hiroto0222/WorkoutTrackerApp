import React from "react";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "store";
import WorkoutDetailCard from "./WorkoutDetailCard";

type Props = {
  pb: number;
};

const WorkoutsFlatList = ({ pb }: Props) => {
  const workoutDataState = useSelector((state: RootState) => state.workoutData);

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, paddingBottom: pb }}
      data={workoutDataState.workouts}
      renderItem={({ item }) => (
        <WorkoutDetailCard
          workout={item}
          logs={workoutDataState.workoutLogs[item.id]}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default WorkoutsFlatList;
