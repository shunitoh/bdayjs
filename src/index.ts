import Holidays, { HolidaysTypes } from "date-holidays";
import dayjs from "dayjs";
import { get as lGet, cloneDeep as lCloneDeep } from "lodash";

type AddHolidayType = {
  day?: string;
  mode: "subtract" | "add";
  num: number;
  unit: "hours" | "days";
};

type BusinessDayType = {
  dj?;
  country?: HolidaysTypes.Country | string;
};

export default class BusinessDay {
  private readonly hd;
  private readonly dj;
  constructor(request: BusinessDayType) {
    this.hd = new Holidays(lGet(request, "country", "JP"));
    this.dj = lGet(request, "dayjs", dayjs);
  }
  addHolidayHours(request: AddHolidayType) {
    const { mode, num, unit } = request;
    const day = lGet(request, "day");
    let currentDay = day ? this.dj(day) : this.dj();

    const hours = unit === 'days' ? num * 24 : num;
    const targetDay = lCloneDeep(currentDay)[mode](hours, 'hours');
    const days =
      mode === "subtract"
        ? currentDay.startOf("day").diff(targetDay.startOf('day'), "days")
        : targetDay.startOf("day").diff(currentDay.startOf("day"), "days");
    let holidayHours = 0;
    let countDay = 0;
    while (days - countDay >= 0) {
      // Count up if it's a holiday or weekend
      if (
        this.hd.isHoliday(currentDay.toDate()) ||
        [0, 6].includes(currentDay.day())
      ) {
        // Calculate the elapsed time on the first day
        if (countDay === 0) {
          holidayHours = mode === "subtract"
              ? currentDay.diff(currentDay.startOf("day"), "hours")
              : currentDay
                  .add(1, "day")
                  .startOf("day")
                  .diff(currentDay, "hours");
        } else {
          holidayHours += 24;
        }
      }
      currentDay = currentDay[mode](1, "days");
      countDay++;
    }
    return hours + holidayHours;
  }
  public subtract = (day, num, unit: "hours" | "days" = "hours") =>
    this.dj(day).subtract(
      this.addHolidayHours({ day, mode: "subtract", num, unit }),
      'hours'
    );
  public add = (day, num, unit: "hours" | "days" = "hours") =>
    this.dj(day).add(this.addHolidayHours({ day, mode: "add", num, unit }), 'hours');
}
