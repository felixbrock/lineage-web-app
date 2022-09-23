import { Month, Day, days, months } from '../../../constants/index';
import translateLabel from '../../../utils/translateLabel';
import { BaseProps } from '../../../utils/base-props';



export interface OnThe {
  which : 'First'| 'Second'| 'Third'| 'Fourth'| 'Last',
  month: Month,
  day: Day
}

type Mode = 'on' | 'on the'; 

export interface RepeatYearlyOnTheProps extends BaseProps {
  mode: Mode,
  onThe: OnThe,
  hasMoreModes: boolean,
}

const RepeatYearlyOnThe = (props: RepeatYearlyOnTheProps) => {
  const isActive = props.mode === 'on the';

  return (
    <div className={`form-group row d-flex align-items-sm-center ${!isActive && 'opacity-50'}`}>
      <div className="col-sm-1 offset-sm-2">
        {props.hasMoreModes && (
          <input
            id={props.id}
            type="radio"
            aria-label="Repeat yearly on the"
            name="repeat.yearly.mode"
            checked={isActive}
            value="on the"
            onChange={props.handleChange}
          />
        )}
      </div>
      <div className="col-sm-1">
        {translateLabel(props.translations, 'repeat.yearly.on_the')}
      </div>

      <div className="col-sm-2">
        <select
          id={`${props.id}-which`}
          name="repeat.yearly.onThe.which"
          aria-label="Repeat yearly on the which"
          className="form-control"
          value={props.onThe.which}
          disabled={!isActive}
          onChange={props.handleChange}
        >
          <option value="First">{translateLabel(props.translations, 'numerals.first')}</option>
          <option value="Second">{translateLabel(props.translations, 'numerals.second')}</option>
          <option value="Third">{translateLabel(props.translations, 'numerals.third')}</option>
          <option value="Fourth">{translateLabel(props.translations, 'numerals.fourth')}</option>
          <option value="Last">{translateLabel(props.translations, 'numerals.last')}</option>
        </select>
      </div>

      <div className="col-sm-3">
        <select
          id={`${props.id}-day`}
          name="repeat.yearly.onThe.day"
          aria-label="Repeat yearly on the day"
          className="form-control"
          value={props.onThe.day}
          disabled={!isActive}
          onChange={props.handleChange}
        >
          {days.map(day => <option key={day} value={day}>{translateLabel(props.translations, `days.${day.toLowerCase()}`)}</option>)}
        </select>
      </div>

      <div className="col-sm-1">
          {translateLabel(props.translations, 'repeat.yearly.of')}
      </div>

      <div className="col-sm-2">
        <select
          id={`${props.id}-month`}
          name="repeat.yearly.onThe.month"
          aria-label="Repeat yearly on the month"
          className="form-control"
          value={props.onThe.month}
          disabled={!isActive}
          onChange={props.handleChange}
        >
          {months.map(month => <option key={month} value={month}>{translateLabel(props.translations, `months.${month.toLowerCase()}`)}</option>)}
        </select>
      </div>

    </div>
  );
};

export default RepeatYearlyOnThe;
