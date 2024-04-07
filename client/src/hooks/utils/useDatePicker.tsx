import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform } from "react-native";
import { useDispatch } from "react-redux";
import { setUserStartDate } from "store/slices/workout";

const useDatePicker = () => {
  const dispatch = useDispatch();

  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState(Platform.OS === "ios");
  const mode: "time" | "date" = "date";

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
    dispatch(setUserStartDate(currentDate.toJSON()));
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return {
    date,
    mode,
    showDatePicker,
    show,
    onChange,
  };
};

export default useDatePicker;
