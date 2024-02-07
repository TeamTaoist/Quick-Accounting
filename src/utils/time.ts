import dayjs from "dayjs";

export const getUTC = () => {
  const offset = dayjs().utcOffset();
  return `UTC+${offset / 60}`;
};

export const formatTime = (time: number | string, formatter?: "-" | ".") => {
  if (!time) return "";
  const f = formatter || "-";

  return dayjs(time).format(`YYYY${f}MM${f}DD HH:mm`);
};

export const formatDate = (time: number | string, formatter?: "-" | ".") => {
  if (!time) return "";
  const f = formatter || "-";
  return dayjs(time).format(`YYYY${f}MM${f}DD`);
};

export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate + " +UTC";
};
