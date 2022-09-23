export const DATE_TIME_FORMAT = 'YYYY-MM-DD';

export const months = [
   'Jan'
  , 'Feb'
  , 'Mar'
  , 'Apr'
  , 'May'
  , 'Jun'
  , 'Jul'
  , 'Aug'
  , 'Sep'
  , 'Oct'
  , 'Nov'
  , 'Dec'
] as const;

export type Month = typeof months[number];  

export const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'Day',
  'Weekday',
  'Weekend day',
] as const;

export type Day = typeof days[number];
