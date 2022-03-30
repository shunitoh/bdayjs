import Holidays, {HolidaysTypes} from "date-holidays";
import dayjs from "dayjs";
import {get as lGet } from 'lodash';

type AddHolidayType = {
  day?: string;
  mode: "subtract" | "add";
  num: number;
  unit: "hours" | "days";
}

type BusinessDayType = {
  dj?;
  country?: HolidaysTypes.Country | string ;
}

export default class BusinessDay {
  private readonly hd;
  private readonly dj;
  constructor(request: BusinessDayType) {
    this.hd = new Holidays(lGet(request, 'country', 'JP'));
    this.dj = lGet(request, 'dayjs', dayjs);
  }
  addHoliday(request: AddHolidayType) {
    const {mode, num, unit} = request;
    const day = lGet(request, 'day');

    let targetDay = day ? this.dj(day) : this.dj();
    let days = unit === "hours" ? Math.ceil(num / 24) : num;
    let holidayCount = 0;
    while (days > 0) {
      // Count up if it's a holiday or weekend
      if (this.hd.isHoliday(targetDay.toDate()) || [0, 6].includes(targetDay.day())) {
        holidayCount++;
        days++;
      }
      targetDay = targetDay[mode](1, "days");
      days--;
    }
    return unit === "hours" ? num + holidayCount * 24 : num + holidayCount;
  }
  public subtract = (day, num, unit: "hours" | "days" = "hours") =>
      this.dj(day).subtract(this.addHoliday({day, mode: "subtract", num, unit}), unit);
  public add = (day, num, unit: "hours" | "days" = "hours") =>
      this.dj(day).add(this.addHoliday({day, mode: "add", num, unit}), unit);
}

