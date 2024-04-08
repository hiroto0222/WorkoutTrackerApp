import { IExerciseResponse, ILogResponse } from "api/types";
import globalStyles from "components/styles";
import React from "react";
import { StyleSheet } from "react-native";
import { Div, Text } from "react-native-magnus";
import UIConstants from "../../../constants";

type Props = {
  exercise: IExerciseResponse;
  logs: ILogResponse[];
};

const ExerciseDetail = ({ exercise, logs }: Props) => {
  return (
    <Div mb={10} flex={1}>
      <Text fontSize="2xl" style={globalStyles.textMedium}>
        {exercise.name}
      </Text>
      {logs.map((log, setNumber) => (
        <Div key={setNumber} row mb={1}>
          <Div mr={10} style={styles.columnOne}>
            <Text
              fontSize="lg"
              style={globalStyles.textSemiBold}
              color={UIConstants.COLORS.GRAY.REGULAR}
            >
              {setNumber + 1}
            </Text>
          </Div>
          {exercise.log_type === "weight_reps" ? (
            <Div row>
              <Text
                mr={7}
                fontSize="lg"
                style={globalStyles.textMedium}
                color={UIConstants.COLORS.GRAY.REGULAR}
              >
                {log.weight} kg
              </Text>
              <Text
                mr={7}
                fontSize="lg"
                style={globalStyles.textMedium}
                color={UIConstants.COLORS.GRAY.REGULAR}
              >
                x
              </Text>
              <Text
                fontSize="lg"
                style={globalStyles.textMedium}
                color={UIConstants.COLORS.GRAY.REGULAR}
              >
                {log.reps}
              </Text>
            </Div>
          ) : exercise.log_type === "reps" ? (
            <Div row>
              <Text
                mr={7}
                fontSize="lg"
                style={globalStyles.textMedium}
                color={UIConstants.COLORS.GRAY.REGULAR}
              >
                x
              </Text>
              <Text
                fontSize="lg"
                style={globalStyles.textMedium}
                color={UIConstants.COLORS.GRAY.REGULAR}
              >
                {log.reps}
              </Text>
            </Div>
          ) : (
            <Div row>
              <Text
                fontSize="lg"
                style={globalStyles.textMedium}
                color={UIConstants.COLORS.GRAY.REGULAR}
              >
                {log.time} s
              </Text>
            </Div>
          )}
        </Div>
      ))}
    </Div>
  );
};

export default ExerciseDetail;

const styles = StyleSheet.create({
  columnOne: {
    justifyContent: "center",
    alignItems: "center",
    width: "8%",
  },
});
