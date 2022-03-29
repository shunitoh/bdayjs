import * as lodash from "lodash";
import Holidays from "date-holidays";
import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");
const hd = new Holidays("JP");

export const subtractValue = (day, num, unit: "hours" | "days" = "hours") => {
  let targetDay = dayjs(day);
  let days = unit === "hours" ? Math.ceil(num / 24) : num;
  let holidayCount = 0;
  while (days > 0) {
    // 祝日か土日だったらカウントアップする
    if (hd.isHoliday(targetDay.toDate()) || [0, 6].includes(targetDay.day())) {
      holidayCount++;
      days++;
    }
    targetDay = targetDay.subtract(1, "days");
    days--;
  }
  return unit === "hours" ? num + holidayCount * 24 : num + holidayCount;
};

const subtract = (day, num, unit: "hours" | "days" = "hours") =>
  dayjs(day).subtract(subtractValue(day, num, unit), unit).format('YYYY-MM-DD HH:mm:ss');

export default subtract;
