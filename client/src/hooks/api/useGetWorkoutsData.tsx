import { IWorkoutsResponse } from "api/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import axios, { API_ENDPOINTS, AxiosResponse } from "../../api";

const useGetWorkoutsData = () => {
  const dispatch = useDispatch();

  const authState = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWorkouts = async () => {
      try {
        const resWorkouts: AxiosResponse<IWorkoutsResponse[]> = await axios.get(
          API_ENDPOINTS.WORKOUTS.GET + authState.userId + `?offset=${0}`,
          {
            headers: {
              Authorization: "Bearer " + authState.accessToken,
            },
          }
        );
        // dispatch(setWorkouts(resWorkouts.data.data));
        setLoading(false);
      } catch (err) {
        console.log(err);
        alert((err as Error).message);
      }
    };

    getWorkouts();
  }, []);

  return { loading };
};

export default useGetWorkoutsData;
