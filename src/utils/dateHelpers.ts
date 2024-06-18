import { format, getMonth, getYear } from 'date-fns';
import { IDateParams } from '../cron/cron.types';

export function getNumberOfDaysDifference(start: string, end: string) {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
}

export function getCurrentDateParams() {
  const currentDate = new Date();

  const currentDateString = format(currentDate, 'yyyy-MM-dd');

  // index 0-11
  const currentMonth = getMonth(currentDate) + 1;

  const currentYear = getYear(currentDate);

  const params: IDateParams = {
    currentDate,
    currentMonth,
    currentYear,
    currentDateString,
  };

  return params;
}
