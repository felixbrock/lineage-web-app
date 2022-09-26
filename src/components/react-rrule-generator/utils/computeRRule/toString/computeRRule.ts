import RRule from 'rrule';

import computeStart from './computeStart';
import computeRepeat from './computeRepeat';
import computeEnd from './computeEnd';
import computeOptions from './computeOptions';

export interface ComputeRRuleProps {
  start: any,
  repeat: any,
  end: any,
  options: any,
}

const computeRRule = (props: ComputeRRuleProps) => {
  const rruleObject = {
    ...computeStart(props.start),
    ...computeRepeat(props.repeat),
    ...computeEnd(props.end),
    ...computeOptions(props.options),
  };
  const rrule = new RRule(rruleObject);
  return rrule.toString();
};

export default computeRRule;
