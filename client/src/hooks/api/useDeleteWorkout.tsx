import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios, { API_ENDPOINTS, AxiosResponse } from "api";
import { HomeStackParams } from "components/screens/Home/HomeScreenStack";
import globalStyles from "components/styles";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { removeWorkout } from "store/slices/workoutData";

const useDeleteWorkout = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();

  const authState = useSelector((state: RootState) => state.auth);

  const deleteWorkout = async (workoutId: string) => {
    try {
      const accessToken = await authState.userCreds?.getIdToken();

      const res: AxiosResponse = await axios.delete(
        API_ENDPOINTS.WORKOUTS.DELETE + workoutId,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      // delete workout from client
      dispatch(removeWorkout(workoutId));
      showMessage({
        message: "Workout deleted",
        type: "danger",
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

  return { deleteWorkout };
};

export default useDeleteWorkout;
