import moment from 'moment';

import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import { Month, months } from '../../../constants/index';
import translateLabel from '../../../utils/translateLabel';
import { BaseProps } from '../../../utils/base-props';

export interface On {
  month: Month,
  day: number
}

type Mode = 'on'| 'on the';

export interface RepeatYearlyOnProps extends BaseProps {
  mode: Mode,
  on: On,
  hasMoreModes: boolean,
}

const RepeatYearlyOn = (props: RepeatYearlyOnProps) => {
  const daysInMonth = moment(props.on.month, 'MMM').daysInMonth();
  const isActive = props.mode === 'on';

  return (
    <div className={`form-group row d-flex align-items-sm-center ${!isActive && 'opacity-50'}`}>
      <div className="col-sm-1 offset-sm-2">

        {props.hasMoreModes && (
          <input
            id={props.id}
            type="radio"
            name="repeat.yearly.mode"
            aria-label="Repeat yearly on"
            value="on"
            checked={isActive}
            onChange={props.handleChange}
          />
        )}
      </div>

      <div className="col-sm-1">
        {translateLabel(props.translations, 'repeat.yearly.on')}
      </div>

      <div className="col-sm-2">
        <select
          id={`${props.id}-month`}
          name="repeat.yearly.on.month"
          aria-label="Repeat yearly on month"
          className="form-control"
          value={props.on.month}
          disabled={!isActive}
          onChange={props.handleChange}
        >
          {months.map(month => <option key={month} value={month}>{translateLabel(props.translations, `months.${month.toLowerCase()}`)}</option>)}
        </select>
      </div>

      <div className="col-sm-2">
        <select
          id={`${props.id}-day`}
          name="repeat.yearly.on.day"
          aria-label="Repeat yearly on a day"
          className="form-control"
          value={props.on.day}
          disabled={!isActive}
          onChange={numericalFieldHandler(props.handleChange)}
        >
          {Array(daysInMonth).fill(0).map((_, i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>
    </div>
  );
};


export default RepeatYearlyOn;
