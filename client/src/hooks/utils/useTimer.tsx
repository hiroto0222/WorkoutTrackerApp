import { useEffect, useState } from "react";
import BackgroundTimer from "react-native-background-timer";

const useTimer = (isAddWorkout: boolean) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isAddWorkout) {
      return;
    }

    let intervalId: number | undefined;
    if (isRunning) {
      intervalId = BackgroundTimer.setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      if (intervalId != undefined) {
        BackgroundTimer.clearInterval(intervalId);
        resetTimer();
      }
    }

    return () => {
      if (intervalId != undefined) {
        BackgroundTimer.clearInterval(intervalId);
        resetTimer();
      }
    };
  }, [isRunning]);

  return { seconds };
};

export default useTimer;
