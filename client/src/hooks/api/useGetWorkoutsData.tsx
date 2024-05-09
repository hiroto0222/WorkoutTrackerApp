import { IWorkoutDataResponse } from "api/types";
import globalStyles from "components/styles";
import { useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setWorkouts } from "store/slices/workoutData";
import axios, { API_ENDPOINTS, AxiosResponse } from "../../api";

const useGetWorkoutsData = () => {
  const dispatch = useDispatch();

  const authState = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWorkouts = async () => {
      try {
        const accessToken = await authState.userCreds?.getIdToken();

        const resWorkouts: AxiosResponse<IWorkoutDataResponse> =
          await axios.get(
            API_ENDPOINTS.WORKOUTS.GET + authState.userId + `?offset=${0}`,
            {
              headers: {
                Authorization: "Bearer " + accessToken,
              },
            }
          );
        const workouts = resWorkouts.data.data.workouts;
        const workoutLogs = resWorkouts.data.data.workout_logs;
        dispatch(setWorkouts({ workouts, workoutLogs }));
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showMessage({
          message: (err as Error).message,
          type: "danger",
          titleStyle: globalStyles.textMedium,
        });
      }
    };

    getWorkouts();
  }, []);

  return { loading };
};

export default useGetWorkoutsData;
