import RRule from 'rrule';

const computeOptions = ({ hideStart, weekStartsOnSunday }: { hideStart: any, weekStartsOnSunday: any }) => {
  const options : {[key: string]: any}= {};

  if (hideStart) {
    options.dtstart = null;
  }

  if (weekStartsOnSunday) {
    options.wkst = RRule.SU;
  }

  return options;
};

export default computeOptions;
