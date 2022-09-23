import RepeatMonthlyOn from './On';
import RepeatMonthlyOnThe from './OnThe';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';
import { BaseProps } from '../../../utils/base-props';
import { Day } from '../../../constants';

type Mode = 'on' | 'on the';

export interface Monthly {
  mode: Mode;
  interval: number;
  on: { day: number };
  onThe: {
    which: 'First' | 'Second' | 'Third' | 'Fourth' | 'Last';
    day: Day;
  };
  options: {
    modes: ['on', 'on the'];
  };
}

export interface RepeatMonthlyProps extends BaseProps {
  monthly: Monthly;
}

const RepeatMonthly = (props: RepeatMonthlyProps) => {
  const isTheOnlyOneMode = false;
  const isOptionAvailable = true;
  // const isTheOnlyOneMode = (option: Mode) =>
  //   props.monthly.options.modes.includes(option) &&
  //   props.monthly.options.modes.length === 1;
  // const isOptionAvailable = (option: Mode) =>
  //   !props.monthly.options.modes || isTheOnlyOneMode(option);

  return (
    <div>
      <div className="form-group row d-flex align-items-sm-center">
        <div className="col-sm-1 offset-sm-2">
          {translateLabel(props.translations, 'repeat.monthly.every')}
        </div>
        <div className="col-sm-3">
          <input
            id={`${props.id}-interval`}
            name="repeat.monthly.interval"
            aria-label="Repeat monthly interval"
            className="form-control"
            value={props.monthly.interval}
            onChange={numericalFieldHandler(props.handleChange)}
          />
        </div>
        <div className="col-sm-1">
          {translateLabel(props.translations, 'repeat.monthly.months')}
        </div>
      </div>

      {isOptionAvailable && (
        <RepeatMonthlyOn
          id={`${props.id}-on`}
          mode={props.monthly.mode}
          on={props.monthly.on}
          hasMoreModes={!isTheOnlyOneMode}
          handleChange={props.handleChange}
          translations={props.translations}
        />
      )}
      {isOptionAvailable && (
        <RepeatMonthlyOnThe
          id={`${props.id}-onThe`}
          mode={props.monthly.mode}
          onThe={props.monthly.onThe}
          hasMoreModes={!isTheOnlyOneMode}
          handleChange={props.handleChange}
          translations={props.translations}
        />
      )}
    </div>
  );
};

export default RepeatMonthly;
