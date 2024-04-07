import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";
import { setUserEndTime, setUserStartTime } from "store/slices/workout";

const useTimePicker = (isEndTimePicker: boolean) => {
  const dispatch = useDispatch();

  const currDate = new Date();
  if (isEndTimePicker) {
    currDate.setHours(currDate.getHours() + 1);
  }

  const [date, setDate] = useState<Date>(currDate);
  const [show, setShow] = useState(Platform.OS === "ios");
  const mode: "time" | "date" = "time";

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (selectedDate === undefined) {
      return;
    }
    const currentDate = selectedDate;
    if (Platform.OS === "android") {
      setShow(false);
    }
    setDate(currentDate);
    if (isEndTimePicker) {
      dispatch(setUserEndTime(currentDate.toJSON()));
    } else {
      dispatch(setUserStartTime(currentDate.toJSON()));
    }
  };

  const showTimePicker = () => {
    setShow(true);
  };

  return {
    date,
    showTimePicker,
    mode,
    show,
    onChange,
  };
};

export default useTimePicker;
