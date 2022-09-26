import RRule from 'rrule';

import computeMonthlyOn from './computeMonthlyOn';
import computeMonthlyOnThe from './computeMonthlyOnThe';

export interface ComputeMonthlyProps {
    mode: any,
    interval: any,
    on: any,
    onThe: any,
}

const computeMonthly = (props: ComputeMonthlyProps) => ({
  freq: RRule.MONTHLY,
  interval: props.interval,
  ...(props.mode === 'on' ? computeMonthlyOn(props.on) : computeMonthlyOnThe(props.onThe)),
});

export default computeMonthly;
