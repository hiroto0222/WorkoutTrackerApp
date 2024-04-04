export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
};

export const convertToDateObject
