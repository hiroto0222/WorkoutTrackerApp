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
