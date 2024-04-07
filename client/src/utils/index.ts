import { IWorkoutsResponse } from "api/types";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const binarySearch = (
  arr: IWorkoutsResponse[],
  target: IWorkoutsResponse
) => {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midDate = new Date(arr[mid].started_at);
    const targetDate = new Date(target.started_at);
    if (targetDate < midDate) {
      left = mid + 1;
    } else if (targetDate > midDate) {
      right = mid - 1;
    } else {
      return mid;
    }
  }

  return left;
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
};

export const getStartingDatesForPastWeeks = (numOfWeeks: number) => {
  const startingDates: Date[] = [];
  const currentDate = new Date();

  for (let i = 0; i < numOfWeeks; i++) {
    const startingDate = new Date(currentDate);
    startingDate.setDate(
      startingDate.getDate() - (i * 7 + startingDate.getDay())
    );
    startingDates.push(startingDate);
  }

  return startingDates.reverse();
};

export const getStartOfWeek = (date: Date) => {
  const val = new Date(date);
  const startOfWeek = date.getDate() - date.getDay();
  return new Date(val.setDate(startOfWeek));
};

export const formatDateToString = (date: Date) => {
  const month = date.getMonth() + 1; // Month is 0-indexed, so add 1
  const day = date.getDate();
  return month + "/" + day;
};

export const getNameOfWeekday = (date: Date) => {
  return weekDays[date.getDay()];
};

export const formatTimeAMPM = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const calculateTimeDifference = (startDate: Date, endDate: Date) => {
  const differenceInMillis = Math.abs(endDate.getTime() - startDate.getTime());
  const hours = Math.floor(differenceInMillis / (1000 * 60 * 60));
  const minutes = Math.floor(
    (differenceInMillis % (1000 * 60 * 60)) / (1000 * 60)
  );

  return { hours, minutes };
};

export const formatTimeDifference = (hours: number, minutes: number) => {
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}h ${formattedMinutes}m`;
};
