import { months } from '../../../constants/index';

const computeYearlyOn = (on: any) => ({
  bymonth: months.indexOf(on.month) + 1,
  bymonthday: on.day,
});

export default computeYearlyOn;
