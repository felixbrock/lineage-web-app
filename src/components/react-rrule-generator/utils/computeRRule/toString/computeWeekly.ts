import RRule from 'rrule';

const computeWeekly = ({ interval, days }: {interval: any, days: any}) => ({
  freq: RRule.WEEKLY,
  interval,
  byweekday: Object.keys(days).filter(key => days[key]),
});

export default computeWeekly;