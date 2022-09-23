import { Day, days } from '../../../constants/index';
import translateLabel from '../../../utils/translateLabel';
import { BaseProps } from '../../../utils/base-props';

type Mode = 'on' | 'on the';

export interface RepeatMonthlyOnTheProps extends BaseProps {
  mode: Mode;
  onThe: {
    which: 'First' | 'Second' | 'Third' | 'Fourth' | 'Last';
    day: Day;
  };
  hasMoreModes: boolean;
}

const RepeatMonthlyOnThe = (props: RepeatMonthlyOnTheProps) => {
  const isActive = props.mode === 'on the';

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
            aria-label="Repeat monthly on the"
            value="on the"
            checked={isActive}
            onChange={props.handleChange}
          />
        )}
      </div>
      <div className="col-sm-1">
        {translateLabel(props.translations, 'repeat.monthly.on_the')}
      </div>

      <div className="col-sm-2">
        <select
          id={`${props.id}-which`}
          name="repeat.monthly.onThe.which"
          aria-label="Repeat monthly on the which"
          className="form-control"
          value={props.onThe.which}
          disabled={!isActive}
          onChange={props.handleChange}
        >
          <option value="First">
            {translateLabel(props.translations, 'numerals.first')}
          </option>
          <option value="Second">
            {translateLabel(props.translations, 'numerals.second')}
          </option>
          <option value="Third">
            {translateLabel(props.translations, 'numerals.third')}
          </option>
          <option value="Fourth">
            {translateLabel(props.translations, 'numerals.fourth')}
          </option>
          <option value="Last">
            {translateLabel(props.translations, 'numerals.last')}
          </option>
        </select>
      </div>

      <div className="col-sm-3">
        <select
          id={`${props.id}-day`}
          name="repeat.monthly.onThe.day"
          aria-label="Repeat monthly on the day"
          className="form-control"
          value={props.onThe.day}
          disabled={!isActive}
          onChange={props.handleChange}
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {translateLabel(props.translations, `days.${day.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RepeatMonthlyOnThe;
