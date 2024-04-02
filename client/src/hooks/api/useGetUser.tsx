import AsyncStorage from "@react-native-async-storage/async-storage";
import { IExercise, IUser } from "api/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setUser } from "store/slices/user";
import axios, { AxiosResponse } from "../../api";

const useGetUser = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const resUser: AxiosResponse<IUser> = await axios.get("user/me", {
          headers: {
            Authorization: "Bearer " + authState.accessToken,
          },
        });
        const user = resUser.data.data;
        dispatch(setUser(user));

        const resExercises: AxiosResponse<IExercise[]> = await axios.get(
          "exercises"
        );
        const exercises = resExercises.data.data;
        await AsyncStorage.setItem("exercises", JSON.stringify(exercises));
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
