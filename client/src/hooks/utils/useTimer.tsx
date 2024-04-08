import { useEffect, useState } from "react";
import BackgroundTimer from "react-native-background-timer";

const useTimer = (isAddWorkout: boolean, startedAt: string | undefined) => {
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

    if (startedAt === undefined) {
      return;
    }

    // check if current active workout data loaded from redux-persist
    const startDate = new Date(startedAt);
    const currDate = new Date();
    const diffInMilli = currDate.getTime() - startDate.getTime();
    // if current time is 5 seconds ahead of the recorded start date
    if (diffInMilli > 1000 * 5) {
      const secondsToAdd = Math.floor(diffInMilli / 1000);
      setSeconds((prevSeconds) => prevSeconds + secondsToAdd);
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
