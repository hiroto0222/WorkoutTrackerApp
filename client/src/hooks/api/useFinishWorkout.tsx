import { ICreateWorkoutRequest, ILogRequest } from "api/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setFinishWorkout } from "store/slices/workout";

const useFinishWorkout = () => {
  const dispatch = useDispatch();
  const workoutState = useSelector((state: RootState) => state.workout);

  const finishWorkout = (userId: string) => {
    const exercise_ids: number[] = [];
    const logs: { [exercise_id: number]: ILogRequest[] } = {};

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

    // if no valid log entries, alert user
    if (exercise_ids.length < 1) {
      alert("no valid log entries!");
      return;
    }

    // else send to server
    const endedAt = new Date().toJSON();
    const data: ICreateWorkoutRequest = {
      user_id: userId,
      started_at: workoutState.startedAt,
      ended_at: endedAt,
      exercise_ids,
      logs,
    };

    console.log(data);

    dispatch(setFinishWorkout());
  };

  return { finishWorkout };
};

export default useFinishWorkout;
