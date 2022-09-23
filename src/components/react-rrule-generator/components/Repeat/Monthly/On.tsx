import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';
import { BaseProps } from '../../../utils/base-props';

type Mode = 'on' | 'on the';

export interface RepeatMonthlyOnProps extends BaseProps {
  mode: Mode;
  on: {
    day: number;
  };
  hasMoreModes: boolean;
}

const RepeatMonthlyOn = (props: RepeatMonthlyOnProps) => {
  const isActive = props.mode === 'on';

  return (
    <div
      className={`form-group row d-flex align-items-sm-center ${
        !isActive && 'opacity-50'
      }`}
    >
      <div className="col-sm-1 offset-sm-2">
        {props.hasMoreModes && (
          <input
            id={props.id}
            type="radio"
            name="repeat.monthly.mode"
            aria-label="Repeat monthly on"
            value="on"
            checked={isActive}
            onChange={props.handleChange}
          />
        )}
      </div>
      <div className="col-sm-1">
        {translateLabel(props.translations, 'repeat.monthly.on_day')}
      </div>

      <div className="col-sm-2">
        <select
          id={`${props.id}-day`}
          name="repeat.monthly.on.day"
          aria-label="Repeat monthly on a day"
          className="form-control"
          value={props.on.day}
          disabled={!isActive}
          onChange={numericalFieldHandler(props.handleChange)}
        >
          {[...new Array(31)].map((day, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RepeatMonthlyOn;
