import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HttpStatusCode } from "axios";
import { UserStackParams } from "navigation/UserStack";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import axios from "../../api";

const useStartWorkout = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParams>>();
  const authState = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  const startWorkout = async () => {
    try {
      const res = await axios.post(
        "workout/create",
        {},
        {
          headers: {
            Authorization: "Bearer " + authState.accessToken,
          },
        }
      );
      if (res.status == HttpStatusCode.Created) {
        setLoading(false);
        navigation.navigate("Workout");
      }
    } catch (err) {
      setLoading(false);
      alert((err as Error).message);
    }
  };

  return { startWorkout, loading };
};

export default useStartWorkout;
