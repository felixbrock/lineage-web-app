import { months } from '../../../constants/index';

const computeYearlyOnTheMonth = (data: any, rruleObj: any) => {
  if (rruleObj.freq !== 0 || !rruleObj.byweekday) {
    return data.repeat.yearly.onThe.month;
  }

  if (typeof rruleObj.bymonth === 'number') {
    return months[rruleObj.bymonth - 1];
  }

  return months[rruleObj.bymonth[0] - 1];
};

export default computeYearlyOnTheMonth;
