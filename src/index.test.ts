import test from "ava";
import dayjs from "dayjs";
import {BusinessDay} from "./";
import "dayjs/locale/ja";
dayjs.locale("ja");
const businessDay = new BusinessDay({dj: dayjs, country: 'JP'})

test("60時間遡る 休日が3日ある 対象日が休日 hour単位", (t) => {
  // 1/10(成人式) => +24, 1/9(日) => +24, 1/8(土) => +24, 1/7, 1/6, 1/5
  const hour = businessDay.addHolidayHours({day: "2022-01-10 03:00:00", mode: "subtract", num: 60, unit: "hours"});
  const subtractDate = businessDay.subtract("2022-01-10 03:00:00", 60, "hours");
  const addDate = businessDay.add("2022-01-10 03:00:00", 60, "hours");
  const expectHour = 111;
  const expectSubtractDate = "2022-01-05 12:00:00";
  const expectAddDate = "2022-01-13 12:00:00";
  t.is(hour, expectHour);
  t.is(subtractDate.format("YYYY-MM-DD HH:mm:ss"), expectSubtractDate);
  t.is(addDate.format("YYYY-MM-DD HH:mm:ss"), expectAddDate);
});

test("60時間遡る 休日が3日ある 対象日が営業日 hour単位", (t) => {
  // 1/11, 1/10(成人式) => +24, 1/9(日) => +24, 1/8(土) => +24, 1/7, 1/6, 1/5
  const hour = businessDay.addHolidayHours({day: "2022-01-11 10:00:00", mode: "subtract", num: 60, unit: "hours"});
  const date = businessDay.subtract("2022-01-11 10:00:00", 60, "hours");
  console.log('date: ', date.format('YYYY-MM-DD HH:mm:ss'))
  const expectHour = 10 + 24 + 24 + 24 + (24 + 24 + 2);
  const expectDate = "2022-01-05 22:00:00";
  t.is(hour, expectHour);
  t.is(date.format("YYYY-MM-DD HH:mm:ss"), expectDate);
});

test("72時間遡る 休日が3日ある 対象日が休日 day単位", (t) => {
  // 1/10(成人式) => +3, 1/9(日) => -+4, 1/8(土) => +24, 1/7, 1/6, 1/5
  const day = businessDay.addHolidayHours({day: "2022-01-10 03:00:00", mode: "subtract", num: 3, unit: "days"});
  const date = businessDay.subtract("2022-01-10 03:00:00", 3, "days");
  const expectDays = 3 + 24 + 24 + (24 * 3);
  const expectDate = "2022-01-05 00:00:00";
  t.is(day, expectDays);
  t.is(date.format("YYYY-MM-DD HH:mm:ss"), expectDate);
});

test("72時間遡る 休日が3日ある 対象日が営業日 day単位", (t) => {
  // 1/11, 1/10(成人式) => +24, 1/9(日) => +24, 1/8(土) => +24, 1/7, 1/6, 1/5
  const hour = businessDay.addHolidayHours({day: "2022-01-11 10:00:00", mode: "subtract", num: 3, unit: "days"});
  const date = businessDay.subtract("2022-01-11 10:00:00", 3, "days");
  const expectHour = 10 + 24 + 24 + 24 + (24 + 24 + 14);
  const expectDate = "2022-01-05 10:00:00";
  t.is(hour, expectHour);
  t.is(date.format("YYYY-MM-DD HH:mm:ss"), expectDate);
});

test("60時間後 休日が1日ある 対象日が休日 hour単位", (t) => {
  // 1/10(成人式) => +21, 1/11, 1/12, 1/13
  const hour = businessDay.addHolidayHours({day: "2022-01-10 03:00:00", mode: "add", num: 60, unit: "hours"});
  const addDate = businessDay.add("2022-01-10 03:00:00", 60, "hours");
  const expectHour = 21 + 24 + 24 + 12;
  const expectAddDate = "2022-01-13 12:00:00";
  t.is(hour, expectHour);
  t.is(addDate.format("YYYY-MM-DD HH:mm:ss"), expectAddDate);
});

test("72時間後 休日が1日ある 対象日が休日 day単位", (t) => {
  // 1/10(成人式) => +21, 1/11, 1/12, 1/13, 1/14
  const hour = businessDay.addHolidayHours({day: "2022-01-10 03:00:00", mode: "add", num: 3, unit: "days"});
  const addDate = businessDay.add("2022-01-10 03:00:00", 3, "days");
  const expectHour = 21 + 24 + 24 + 24;
  const expectAddDate = "2022-01-14 00:00:00";
  t.is(hour, expectHour);
  t.is(addDate.format("YYYY-MM-DD HH:mm:ss"), expectAddDate);
});
