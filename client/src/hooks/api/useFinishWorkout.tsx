import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ICreateWorkoutRequest,
  ICreateWorkoutResponse,
  ILogs,
} from "api/types";
import globalStyles from "components/styles";
import { RootStackParams } from "navigation/RootStack";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setFinishWorkout } from "store/slices/workout";
import { addFinishedWorkout } from "store/slices/workoutData";
import axios, { API_ENDPOINTS, AxiosResponse } from "../../api";

const useFinishWorkout = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const workoutState = useSelector((state: RootState) => state.workout);
  const authState = useSelector((state: RootState) => state.auth);

  const validateAndCreateWorkoutData = (isAddWorkout: boolean) => {
    let message = "Your workout is empty!";
    var isValid = false;
    const exercise_ids: number[] = [];
    const logs: ILogs = {};

    // validate dates
    if (
      isAddWorkout &&
      workoutState.userStartTime !== undefined &&
      workoutState.userEndTime !== undefined
    ) {
      const userStartTime = new Date(workoutState.userStartTime);
      const userEndTime = new Date(workoutState.userEndTime);
      if (userStartTime >= userEndTime) {
        message = "Set a valid start and end time!";
        return { isValid, exercise_ids, logs, message };
      }
    }

    // validate data
    workoutState.currExercises.forEach((exercise) => {
      // if there is a log entry for exercise
      if (exercise.id in workoutState.currLogs) {
        workoutState.currLogs[exercise.id].forEach((log) => {
          // if log entry is completed, add to logs
          if (log.isCompleted) {
            const newLog = {
              weight: log.weight,
              reps: log.reps,
              time: log.time,
            };
            if (exercise.id in logs) {
              logs[exercise.id].push(newLog);
            } else {
              logs[exercise.id] = [newLog];
            }
          }
        });
        // if exercise has a log entry, add to exercise_ids
        if (exercise.id in logs) {
          exercise_ids.push(exercise.id);
        }
      }
    });

    // check if valid entries
    if (exercise_ids.length > 0) {
      isValid = true;
    }

    return { isValid, exercise_ids, logs, message };
  };

  const sendWorkoutData = async (
    isAddWorkout: boolean,
    exercise_ids: number[],
    logs: ILogs
  ) => {
    // send to server
    if (authState.userId === undefined) {
      console.log("no user id");
      return;
    }

    let message = "Workout completed! Good work 💪";

    const endedAt = new Date();
    let data: ICreateWorkoutRequest = {
      user_id: authState.userId,
      started_at: workoutState.startedAt,
      ended_at: endedAt.toJSON(),
      exercise_ids,
      logs,
    };

    // if dates have been selected by the user
    if (
      isAddWorkout &&
      workoutState.userStartDate !== undefined &&
      workoutState.userStartTime !== undefined &&
      workoutState.userEndTime !== undefined
    ) {
      const userStartDate = new Date(workoutState.userStartDate);
      const userStartTime = new Date(workoutState.userStartTime);
      const userEndTime = new Date(workoutState.userEndTime);
      userStartDate.setHours(
        userStartTime.getHours(),
        userStartTime.getMinutes(),
        userStartTime.getSeconds()
      );
      userEndTime.setFullYear(userStartDate.getFullYear());
      userEndTime.setMonth(userStartDate.getMonth());
      userEndTime.setDate(userStartDate.getDate());
      data.started_at = userStartDate.toJSON();
      data.ended_at = userEndTime.toJSON();
      message = "Workout added!";
    }

    try {
      const res: AxiosResponse<ICreateWorkoutResponse> = await axios.post(
        API_ENDPOINTS.WORKOUTS.CREATE,
        data,
        {
          headers: {
            Authorization: "Bearer " + authState.accessToken,
          },
        }
      );

      const resData = res.data.data;
      // make sure isFinishWorkout is updated before navigation pop
      await dispatch(setFinishWorkout());
      // add data to local
      console.log(resData);
      await dispatch(addFinishedWorkout(resData));
      showMessage({
        message,
        type: "success",
        titleStyle: globalStyles.textMedium,
      });
      navigation.popToTop();
    } catch (err) {
      showMessage({
        message: (err as Error).message,
        type: "danger",
        titleStyle: globalStyles.textMedium,
      });
    }
  };

  return { validateAndCreateWorkoutData, sendWorkoutData };
};

export default useFinishWorkout;
