import { IExerciseResponse, ILogResponse } from "api/types";
import globalStyles from "components/styles";
import React from "react";
import { Div, Text } from "react-native-magnus";
import { formatTime } from "utils";

type Props = {
  exercise: IExerciseResponse;
  logs: ILogResponse[];
};

const ExerciseLogsDetail = ({ exercise, logs }: Props) => {
  let maxReps = 0;
  let maxWeight = 0;
  let maxTime = 0;

  const calculateBestSet = () => {
    logs.forEach((log) => {
      maxReps = Math.max(maxReps, log.reps || 0);
      maxWeight = Math.max(maxWeight, log.weight || 0);
      maxTime = Math.max(maxTime, log.time || 0);
    });

    switch (exercise.log_type) {
      case "weight_reps":
        return `${maxWeight} kg`;
      case "reps":
        return `x ${maxReps}`;
      case "timer":
        return formatTime(maxTime);
      default:
        return 0;
    }
  };

  const bestSet = calculateBestSet();

  return (
    <Div row justifyContent="space-between" style={{ width: "100%" }}>
      <Text fontSize="md" style={globalStyles.textRegular}>
        {logs.length} x {exercise.name}
      </Text>
      <Text fontSize="md" style={globalStyles.textRegular}>
        {bestSet}
      </Text>
    </Div>
  );
};

export default ExerciseLogsDetail;
