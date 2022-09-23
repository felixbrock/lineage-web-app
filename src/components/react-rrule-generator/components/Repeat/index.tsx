import RepeatYearly, { Yearly } from './Yearly/index';
import RepeatMonthly, { Monthly } from './Monthly/index';
import RepeatWeekly, { Weekly } from './Weekly/index';
import RepeatDaily, { Daily } from './Daily/index';
import RepeatHourly, { Hourly } from './Hourly/index';
import translateLabel from '../../utils/translateLabel';
import { BaseProps } from '../../utils/base-props';

type Frequency = 'Yearly' | 'Monthly' | 'Weekly' | 'Daily' | 'Hourly';
type On = 'on' | 'on the';

export interface RepeatProps extends BaseProps {
  repeat: {
    frequency: Frequency;
    yearly: Yearly;
    monthly: Monthly;
    weekly: Weekly;
    daily: Daily;
    hourly: Hourly;
    options: {
      frequency: ['Yearly', 'Monthly', 'Weekly', 'Daily', 'Hourly'];
      yearly: On;
      monthly: On;
    };
  };
}

const Repeat = (props: RepeatProps) => {
  const isOptionAvailable = (option: Frequency) =>
    !props.repeat.options.frequency || props.repeat.options.frequency.indexOf(option) !== -1;
  const isOptionSelected = (option: Frequency) => props.repeat.frequency === option;

  return (
    <div className="px-3">
      <div className="form-group row">
        <div className="col-sm-2 text-sm-right">
          <label htmlFor={`${props.id}-frequency`} className="col-form-label">
            <strong>{translateLabel(props.translations, 'repeat.label')}</strong>
          </label>
        </div>
        <div className="col-sm-6">
          <select
            name="repeat.frequency"
            id={`${props.id}-frequency`}
            className="form-control"
            value={props.repeat.frequency}
            onChange={props.handleChange}
          >
            {isOptionAvailable('Yearly') && (
              <option value="Yearly">
                {translateLabel(props.translations, 'repeat.yearly.label')}
              </option>
            )}
            {isOptionAvailable('Monthly') && (
              <option value="Monthly">
                {translateLabel(props.translations, 'repeat.monthly.label')}
              </option>
            )}
            {isOptionAvailable('Weekly') && (
              <option value="Weekly">
                {translateLabel(props.translations, 'repeat.weekly.label')}
              </option>
            )}
            {isOptionAvailable('Daily') && (
              <option value="Daily">
                {translateLabel(props.translations, 'repeat.daily.label')}
              </option>
            )}
            {isOptionAvailable('Hourly') && (
              <option value="Hourly">
                {translateLabel(props.translations, 'repeat.hourly.label')}
              </option>
            )}
          </select>
        </div>
      </div>

      {isOptionSelected('Yearly') && (
        <RepeatYearly
          id={`${props.id}-yearly`}
          yearly={props.repeat.yearly}
          handleChange={props.handleChange}
          translations={props.translations}
        />
      )}
      {isOptionSelected('Monthly') && (
        <RepeatMonthly
          id={`${props.id}-monthly`}
          monthly={props.repeat.monthly}
          handleChange={props.handleChange}
          translations={props.translations}
        />
      )}
      {isOptionSelected('Weekly') && (
        <RepeatWeekly
          id={`${props.id}-weekly`}
          weekly={props.repeat.weekly}
          handleChange={props.handleChange}
          translations={props.translations}
        />
      )}
      {isOptionSelected('Daily') && (
        <RepeatDaily
          id={`${props.id}-daily`}
          daily={props.repeat.daily}
          handleChange={props.handleChange}
          translations={props.translations}
        />
      )}
      {isOptionSelected('Hourly') && (
        <RepeatHourly
          id={`${props.id}-hourly`}
          hourly={props.repeat.hourly}
          handleChange={props.handleChange}
          translations={props.translations}
        />
      )}
    </div>
  );
};

export default Repeat;
