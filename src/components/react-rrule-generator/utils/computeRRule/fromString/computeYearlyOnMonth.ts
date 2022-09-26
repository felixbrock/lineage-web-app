import { months } from '../../../constants/index';

const computeYearlyOnMonth = (data: any, rruleObj: any) => {
  if (rruleObj.freq !== 0 || !rruleObj.bymonthday) {
    return data.repeat.yearly.on.month;
  }

  if (typeof rruleObj.bymonth === 'number') {
    return months[rruleObj.bymonth - 1];
  }

  return months[rruleObj.bymonth[0] - 1];
};

export default computeYearlyOnMonth;
