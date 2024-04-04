import { IWorkoutsResponse } from "api/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import axios, { API_ENDPOINTS, AxiosResponse } from "../../api";

const useGetWorkouts = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [workoutsData, setWorkoutsData] = useState<IWorkoutsResponse[]>([]);

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
        console.log(resWorkouts.data.data);
        setWorkoutsData(resWorkouts.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        alert((err as Error).message);
      }
    };

    getWorkouts();
  }, []);

  return { loading, workoutsData };
};

export default useGetWorkouts;
