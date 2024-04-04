import AsyncStorage from "@react-native-async-storage/async-storage";
import { IExerciseResponse } from "api/types";
import { useEffect, useState } from "react";

const useGetExercises = () => {
  const [exercises, setExercises] = useState<IExerciseResponse[]>([]);

  useEffect(() => {
    const getExercises = async () => {
      try {
        const value = await AsyncStorage.getItem("exercises");
        if (value != null) {
          const parsed = JSON.parse(value) as IExerciseResponse[];
          setExercises(parsed);
        }
      } catch (err) {
        console.log(err);
        alert((err as Error).message);
      }
    };

    getExercises();
  }, []);

  return { exercises };
};

export default useGetExercises;
