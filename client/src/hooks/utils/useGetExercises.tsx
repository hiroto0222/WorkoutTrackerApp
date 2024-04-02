import AsyncStorage from "@react-native-async-storage/async-storage";
import { IExercise } from "api/types";
import { useEffect, useState } from "react";

const useGetExercises = () => {
  const [exercises, setExercises] = useState<IExercise[]>([]);

  useEffect(() => {
    const getExercises = async () => {
      try {
        const value = await AsyncStorage.getItem("exercises");
        if (value != null) {
          const parsed = JSON.parse(value) as IExercise[];
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
