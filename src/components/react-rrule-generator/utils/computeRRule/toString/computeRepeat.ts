import computeYearly from './computeYearly';
import computeMonthly from './computeMonthly';
import computeWeekly from './computeWeekly';
import computeDaily from './computeDaily';
import computeHourly from './computeHourly';

export interface ComputeRepeatProps {
  frequency: any,
  yearly: any,
  monthly: any,
  weekly: any,
  daily: any,
  hourly: any,
}

const computeRepeat = (props: ComputeRepeatProps) => {
  switch (props.frequency) {
    case 'Yearly': {
      return computeYearly(props.yearly);
    }
    case 'Monthly': {
      return computeMonthly(props.monthly);
    }
    case 'Weekly': {
      return computeWeekly(props.weekly);
    }
    case 'Daily': {
      return computeDaily(props.daily);
    }
    case 'Hourly': {
      return computeHourly(props.hourly);
    }
    default:
      return {};
  }
};

export default computeRepeat;
