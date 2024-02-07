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
