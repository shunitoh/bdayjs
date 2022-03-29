import * as lodash from "lodash";
import Holidays from "date-holidays";
import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");
const hd = new Holidays("JP");

export const addHoliday = (day, mode: 'subtract' | 'add', num, unit: "hours" | "days" = "hours") => {
  let targetDay = dayjs(day);
  let days = unit === "hours" ? Math.ceil(num / 24) : num;
  let holidayCount = 0;
  while (days > 0) {
    // 祝日か土日だったらカウントアップする
    if (hd.isHoliday(targetDay.toDate()) || [0, 6].includes(targetDay.day())) {
      holidayCount++;
      days++;
    }
    targetDay = targetDay[mode](1, "days");
    days--;
  }
  return unit === "hours" ? num + holidayCount * 24 : num + holidayCount;
};

export const subtract = (day, num, unit: "hours" | "days" = "hours") =>
  dayjs(day).subtract(addHoliday(day, 'subtract', num, unit), unit);
export const add = (day, num, unit: "hours" | "days" = "hours") =>
    dayjs(day).add(addHoliday(day, 'add', num, unit), unit);
