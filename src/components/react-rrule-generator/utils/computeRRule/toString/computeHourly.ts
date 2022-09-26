import RRule from 'rrule';

const computeHourly = ({ interval }: {interval: any}) => ({
  freq: RRule.HOURLY,
  interval,
});

export default computeHourly;
