import { IExerciseResponse, IUser } from "api/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setExercises } from "store/slices/exercises";
import { setUser } from "store/slices/user";
import axios, { API_ENDPOINTS, AxiosResponse } from "../../api";

const useGetUser = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const resUser: AxiosResponse<IUser> = await axios.get(
          API_ENDPOINTS.USERS.GET,
          {
            headers: {
              Authorization: "Bearer " + authState.accessToken,
            },
          }
        );
        const user = resUser.data.data;
        dispatch(setUser(user));

        // get exercises
        const resExercises: AxiosResponse<IExerciseResponse[]> =
          await axios.get(API_ENDPOINTS.EXERCISES.GET);
        const exercises = resExercises.data.data;
        dispatch(setExercises(exercises));
      } catch (err) {
        console.log(err);
        alert((err as Error).message);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  return { loading };
};

export default useGetUser;
