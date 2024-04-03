import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ICreateWorkoutRequest, ILogRequests } from "api/types";
import { UserStackParams } from "navigation/UserStack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setFinishWorkout } from "store/slices/workout";
import axios from "../../api";

const useFinishWorkout = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParams>>();
  const workoutState = useSelector((state: RootState) => state.workout);
  const authState = useSelector((state: RootState) => state.auth);

  const validateAndCreateWorkoutData = () => {
    var isValid = false;
    const exercise_ids: number[] = [];
    const logs: ILogRequests = {};

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

    return { isValid, exercise_ids, logs };
  };

  const sendWorkoutData = async (
    exercise_ids: number[],
    logs: ILogRequests
  ) => {
    // else send to server
    if (authState.userId === undefined) {
      console.log("no user id");
      return;
    }
    const endedAt = new Date().toJSON();
    const data: ICreateWorkoutRequest = {
      user_id: authState.userId,
      started_at: workoutState.startedAt,
      ended_at: endedAt,
      exercise_ids,
      logs,
    };

    console.log(data);

    try {
      const res = await axios.post("workout/create", data, {
        headers: {
          Authorization: "Bearer " + authState.accessToken,
        },
      });
      console.log(res);
      // make sure isFinishWorkout is updated before navigation pop
      await dispatch(setFinishWorkout());
      navigation.popToTop();
    } catch (err) {
      console.log(err);
      alert((err as Error).message);
    }
  };

  return { validateAndCreateWorkoutData, sendWorkoutData };
};

export default useFinishWorkout;
