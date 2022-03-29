import test from 'ava';
import {add, subtract, addHoliday} from './index';

test('60時間遡る 休日が3日ある 対象日が休日 hour単位', t => {
  // 1/10(成人式) => +24, 1/9(日) => +24, 1/8(土) => +24, 1/7, 1/6, 1/5
  const hour = addHoliday('2022-01-10 03:00:00','subtract', 60, 'hours');
  const subtractDate = subtract('2022-01-10 03:00:00', 60, 'hours');
  const addDate = add('2022-01-10 03:00:00', 60, 'hours');
  const expectHour = 24 * 3 + 60;
  const expectSubtractDate = '2022-01-04 15:00:00';
  const expectAddDate = '2022-01-13 15:00:00';
  t.is(hour, expectHour);
  t.is(subtractDate.format('YYYY-MM-DD HH:mm:ss'), expectSubtractDate);
  t.is(addDate.format('YYYY-MM-DD HH:mm:ss'), expectAddDate);
});

test('60時間遡る 休日が3日ある 対象日が営業日 hour単位', t => {
  // 1/10(成人式) => +24, 1/9(日) => +24, 1/8(土) => +24, 1/7, 1/6, 1/5
  const hour = addHoliday('2022-01-11 10:00:00', 'subtract',60, 'hours');
  const date = subtract('2022-01-11 10:00:00', 60, 'hours');
  const expectHour = 24*3 + 60;
  const expectDate = '2022-01-05 22:00:00';
  t.is(hour, expectHour);
  t.is(date.format('YYYY-MM-DD HH:mm:ss'), expectDate);
});

test('60時間遡る 休日が3日ある 対象日が休日 day単位', t => {
  // 1/10(成人式) => +24, 1/9(日) => +24, 1/8(土) => +24, 1/7, 1/6, 1/5
  const hour = addHoliday('2022-01-10 03:00:00', 'subtract', 3, 'days');
  const date = subtract('2022-01-10 03:00:00', 3, 'days');
  const expectDays = 3 + 3;
  const expectDate = '2022-01-04 03:00:00';
  t.is(hour, expectDays);
  t.is(date.format('YYYY-MM-DD HH:mm:ss'), expectDate);
});

test('60時間遡る 休日が3日ある 対象日が営業日 day単位', t => {
  // 1/10(成人式) => +24, 1/9(日) => +24, 1/8(土) => +24, 1/7, 1/6, 1/5
  const hour = addHoliday('2022-01-11 10:00:00', 'subtract', 3, 'days');
  const date = subtract('2022-01-11 10:00:00', 3, 'days');
  const expectHour = 3 + 3;
  const expectDate = '2022-01-05 10:00:00';
  t.is(hour, expectHour);
  t.is(date.format('YYYY-MM-DD HH:mm:ss'), expectDate);
});
